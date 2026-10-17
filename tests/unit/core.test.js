// Unit test inti matematika Prediktor (node:test, tanpa dependensi tambahan).
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../../site/core.js');

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg || ''} ${a} vs ${b}`);

test('kuadrat terkecil sesuai rumus tertutup di satuan asli', () => {
  // y = 3x + 2 tepat, jadi error terbaik 0.
  const pts = [1, 2, 3, 4, 5, 6].map((x) => ({ x, y: 3 * x + 2 }));
  const n = C.makeNorm(pts);
  const ls = C.leastSquares(n);
  const o = C.toOriginal(n, ls.w, ls.b);
  close(o.w, 3, 1e-9, 'w'); close(o.b, 2, 1e-9, 'b'); close(ls.loss, 0, 1e-12, 'loss');
});

test('kuadrat terkecil cocok dengan perhitungan manual untuk data papan tulis', () => {
  const pts = [[1, 6], [2, 9], [4, 15], [6, 19], [8, 26]].map(([x, y]) => ({ x, y }));
  const n = C.makeNorm(pts);
  const ls = C.leastSquares(n);
  const o = C.toOriginal(n, ls.w, ls.b);
  close(o.w, 91 / 32.8, 1e-9, 'w');
  close(o.b, 15 - (91 / 32.8) * 4.2, 1e-9, 'b');
  // Error ternormalisasi yang dikonversi harus sama dengan MSE di satuan asli.
  close(C.lossToOriginal(n, ls.loss), C.mseOriginal(pts, o.w, o.b), 1e-9, 'mse');
  // Tidak ada titik di sekitar optimum yang lebih baik.
  for (const [dw, db] of [[0.01, 0], [-0.01, 0], [0, 0.01], [0, -0.01]]) {
    assert.ok(C.lossNorm(n, ls.w + dw, ls.b + db) > ls.loss);
  }
});

test('konversi satuan asli dan ternormalisasi saling balik', () => {
  const n = C.makeNorm(C.SCENARIOS[1].points);
  const o = C.toOriginal(n, 0.7, -0.2);
  const back = C.toNormalized(n, o.w, o.b);
  close(back.w, 0.7, 1e-12); close(back.b, -0.2, 1e-12);
});

for (const sc of C.SCENARIOS) {
  test(`preset learning rate berperilaku benar: ${sc.name}`, () => {
    assert.ok(sc.points.length >= 6 && sc.points.length <= 10, 'skenario berisi 6 sampai 10 titik');
    const n = C.makeNorm(sc.points);
    const opt = C.leastSquares(n);
    const p = C.lrPresets(n);
    close(p.pas, 0.5 * (2 / p.lambda), 1e-12);
    const pas = C.runGD(n, { lr: p.pas, steps: 100 });
    const kecil = C.runGD(n, { lr: p.kecil, steps: 100 });
    const besar = C.runGD(n, { lr: p.besar, steps: 100 });
    // Pas: konvergen, selisih kurang dari 1% dari jawaban terbaik.
    assert.equal(pas.diverged, false);
    assert.ok(C.gapPercent(pas.loss, opt.loss) < 1, `pas gap ${C.gapPercent(pas.loss, opt.loss)}`);
    // Terlalu kecil: tidak divergen, tetapi masih jauh dari lembah.
    assert.equal(kecil.diverged, false);
    assert.ok(kecil.loss > 10 * pas.loss, 'terlalu kecil masih merayap');
    assert.ok(kecil.loss < kecil.path[0].loss, 'terlalu kecil tetap turun');
    // Terlalu besar: divergen atau berosilasi dengan error membesar.
    assert.equal(besar.diverged, true);
    assert.ok(besar.path[besar.path.length - 1].loss > besar.path[0].loss);
  });
}

test('preset tetap terjamin pada data acak', () => {
  const rng = C.mulberry32(7);
  for (let t = 0; t < 50; t++) {
    const pts = [];
    const k = 6 + Math.floor(rng() * 5);
    for (let i = 0; i < k; i++) pts.push({ x: rng() * 100, y: rng() * 50 - 10 });
    const n = C.makeNorm(pts);
    const opt = C.leastSquares(n);
    const p = C.lrPresets(n);
    const pas = C.runGD(n, { lr: p.pas, steps: 300 });
    const besar = C.runGD(n, { lr: p.besar, steps: 300 });
    assert.equal(pas.diverged, false);
    assert.ok(pas.loss <= opt.loss * 1.05 + 1e-9, `data acak ${t}`);
    assert.equal(besar.diverged, true, `data acak ${t} harus divergen`);
  }
});

test('GA dengan seed sama selalu memberi hasil sama', () => {
  const n = C.makeNorm(C.SCENARIOS[0].points);
  const a = C.runGA(n, { pop: 20, gens: 30, mutation: 0.3, seed: 2026 });
  const b = C.runGA(n, { pop: 20, gens: 30, mutation: 0.3, seed: 2026 });
  const c = C.runGA(n, { pop: 20, gens: 30, mutation: 0.3, seed: 2027 });
  assert.deepEqual(a.history, b.history);
  assert.equal(a.loss, b.loss);
  assert.notEqual(a.loss, c.loss);
  assert.equal(a.evals, 20 * 30);
  assert.equal(a.history.length, 30);
  // Elitisme: error terbaik tidak pernah naik antargenerasi.
  for (let g = 1; g < a.history.length; g++) assert.ok(a.history[g].best.loss <= a.history[g - 1].best.loss);
});

test('GA tidak pernah lebih baik dari jawaban terbaik, dan cukup dekat', () => {
  for (const sc of C.SCENARIOS) {
    const n = C.makeNorm(sc.points);
    const opt = C.leastSquares(n);
    const m = C.runGAMany(n, { pop: 20, gens: 30, mutation: 0.3, seed: 2026 }, 5);
    for (const r of m.runs) {
      assert.ok(r.loss >= opt.loss - 1e-12);
      assert.ok(C.gapPercent(r.loss, opt.loss) < 25);
    }
  }
});

test('Jalankan 5 kali memakai seed berurutan dan statistiknya benar', () => {
  const n = C.makeNorm(C.SCENARIOS[2].points);
  const m = C.runGAMany(n, { pop: 12, gens: 10, mutation: 0.3, seed: 100 }, 5);
  assert.deepEqual(m.runs.map((r) => r.seed), [100, 101, 102, 103, 104]);
  const losses = m.runs.map((r) => r.loss);
  assert.equal(m.stats.best, Math.min(...losses));
  assert.equal(m.stats.worst, Math.max(...losses));
  close(m.stats.mean, losses.reduce((s, v) => s + v, 0) / 5, 1e-15);
  assert.equal(losses[m.stats.bestIndex], m.stats.best);
  // Jalan pertama sama dengan satu kali GA dengan seed dasar.
  assert.equal(m.runs[0].loss, C.runGA(n, { pop: 12, gens: 10, mutation: 0.3, seed: 100 }).loss);
});

test('runStats dan gapPercent', () => {
  assert.deepEqual(C.runStats([3, 1, 2]), { best: 1, worst: 3, mean: 2, bestIndex: 1 });
  assert.equal(C.runStats([]), null);
  close(C.gapPercent(1.1, 1), 10, 1e-9);
  assert.equal(C.gapPercent(0.5, 0), null);
});

test('kalimat prediksi dalam konteks skenario', () => {
  const sc = C.SCENARIOS[0];
  const r = C.predictionSentence(sc, { w: 3, b: 0 }, '7', { xMin: 1, xMax: 10 });
  assert.equal(r.ok, true);
  assert.equal(r.text, 'Untuk jarak 7 km, perkiraan waktu tempuh sekitar 21 menit.');
  assert.equal(r.notes.length, 0);
  const d = C.predictionSentence(sc, { w: 2, b: 0.5 }, '2,5', { xMin: 1, xMax: 10 });
  assert.equal(d.text, 'Untuk jarak 2,5 km, perkiraan waktu tempuh sekitar 5,5 menit.');
  const out = C.predictionSentence(sc, { w: 3, b: 0 }, '25', { xMin: 1, xMax: 10 });
  assert.match(out.notes[0], /di luar rentang data \(1 sampai 10\)/);
  const neg = C.predictionSentence(sc, { w: 3, b: -10 }, '1', { xMin: 1, xMax: 10 });
  assert.match(neg.notes.join(' '), /negatif/);
  assert.equal(C.predictionSentence(sc, { w: 1, b: 0 }, '', null).ok, false);
  assert.match(C.predictionSentence(sc, { w: 1, b: 0 }, '  ', null).text, /isi nilai jarak/);
  assert.match(C.predictionSentence(sc, { w: 1, b: 0 }, 'tujuh', null).text, /belum bisa dibaca/);
  assert.match(C.predictionSentence(sc, null, '7', null).text, /belum dilatih/);
  const custom = { xLabel: 'x', xUnit: '', yLabel: 'y', yUnit: '' };
  assert.equal(C.predictionSentence(custom, { w: 1, b: 1 }, '3', null).text, 'Untuk x 3, perkiraan y sekitar 4.');
});

test('format dan parse angka gaya Indonesia', () => {
  assert.equal(C.formatNumber(1234.5, 1), '1.234,5');
  assert.equal(C.formatNumber(-0.001, 2), '0,00');
  assert.equal(C.formatSmart(7), '7');
  assert.equal(C.formatSmart(21.4), '21');
  assert.equal(C.formatSmart(2.5), '2,5');
  assert.equal(C.parseNumber('2,5'), 2.5);
  assert.equal(C.parseNumber('2.5'), 2.5);
  assert.equal(C.parseNumber('1.234,5'), 1234.5);
  assert.equal(C.parseNumber('-3'), -3);
  assert.equal(C.parseNumber('abc'), null);
  assert.equal(C.parseNumber(''), null);
  assert.equal(C.parseNumber('1e999'), null);
});

test('pengaman NaN dan Infinity pada GD', () => {
  const n = C.makeNorm(C.SCENARIOS[0].points);
  for (const lr of [1e200, Infinity, NaN, 50]) {
    const r = C.runGD(n, { lr, steps: 300 });
    assert.equal(r.diverged, true, `lr ${lr}`);
    assert.ok(Number.isFinite(r.loss) && Number.isFinite(r.w) && Number.isFinite(r.b), `lr ${lr} tetap berhingga`);
    for (const p of r.path) assert.ok(Number.isFinite(p.loss));
  }
});

test('validasi data', () => {
  assert.equal(C.validate([]).ok, false);
  assert.equal(C.validate([{ x: 1, y: 2 }]).ok, false);
  assert.match(C.validate([{ x: 1, y: 2 }, { x: 1, y: 3 }]).message, /x yang berbeda/);
  assert.equal(C.validate([{ x: 1, y: 2 }, { x: 2, y: NaN }, { x: 3, y: 1 }]).ok, true);
});
