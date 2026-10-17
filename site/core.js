/* Inti matematika Prediktor: model y = w*x + b, error MSE, GD, GA.
   Berkas ini dipakai di browser (sebagai window.Core) dan di Node (untuk unit test).
   Tanpa dependensi dan tanpa akses jaringan. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Core = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Titik awal GD yang sama untuk semua kelompok (dalam skala ternormalisasi).
  var GD_START = { w: -0.5, b: -0.5 };
  // Kotak awal populasi GA (skala ternormalisasi), tidak memakai pengetahuan jawaban terbaik.
  var GA_INIT_BOX = { wMin: -2, wMax: 2, bMin: -2, bMax: 2 };
  var GA_SIGMA = 0.15;
  var GA_TOURNAMENT = 3;
  var GA_ALPHA = 0.3;
  var DEFAULT_SEED = 2026;

  // Skenario preset. Semua data fiktif dan netral.
  var SCENARIOS = [
    {
      id: 'jarak', name: 'Jarak dan waktu tempuh',
      xLabel: 'jarak', xUnit: 'km', yLabel: 'waktu tempuh', yUnit: 'menit', nonNegative: true,
      points: [{ x: 1, y: 6 }, { x: 2, y: 9 }, { x: 3, y: 11 }, { x: 4, y: 15 }, { x: 5, y: 17 },
        { x: 6, y: 19 }, { x: 8, y: 26 }, { x: 10, y: 31 }]
    },
    {
      id: 'esteh', name: 'Suhu udara dan es teh terjual',
      xLabel: 'suhu udara', xUnit: '°C', yLabel: 'es teh terjual', yUnit: 'gelas', nonNegative: true,
      points: [{ x: 24, y: 30 }, { x: 25, y: 34 }, { x: 26, y: 37 }, { x: 27, y: 43 }, { x: 28, y: 45 },
        { x: 29, y: 52 }, { x: 30, y: 55 }, { x: 31, y: 58 }, { x: 32, y: 64 }]
    },
    {
      id: 'kantin', name: 'Pengunjung kantin dan porsi terjual',
      xLabel: 'jumlah pengunjung', xUnit: 'orang', yLabel: 'porsi terjual', yUnit: 'porsi', nonNegative: true,
      points: [{ x: 40, y: 33 }, { x: 55, y: 47 }, { x: 60, y: 50 }, { x: 75, y: 60 }, { x: 90, y: 74 },
        { x: 100, y: 80 }, { x: 120, y: 99 }, { x: 140, y: 112 }]
    }
  ];

  // PRNG ber-seed (mulberry32), supaya demo sama persis di semua ruangan.
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Bilangan acak normal baku (Box-Muller).
  function gaussian(rng) {
    var u = 0;
    while (u === 0) u = rng();
    var v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Ambil hanya titik yang valid (angka berhingga).
  function cleanPoints(points) {
    var out = [];
    for (var i = 0; i < (points || []).length; i++) {
      var p = points[i];
      if (p && isFinite(p.x) && isFinite(p.y) && p.x !== null && p.y !== null) {
        out.push({ x: Number(p.x), y: Number(p.y) });
      }
    }
    return out;
  }

  // Periksa apakah data cukup untuk dilatih.
  function validate(points) {
    var pts = cleanPoints(points);
    if (pts.length < 2) return { ok: false, message: 'Butuh minimal 2 titik data yang valid.' };
    var xs = {};
    var distinct = 0;
    for (var i = 0; i < pts.length; i++) {
      if (!xs[pts[i].x]) { xs[pts[i].x] = true; distinct++; }
    }
    if (distinct < 2) return { ok: false, message: 'Butuh minimal 2 titik dengan nilai x yang berbeda.' };
    return { ok: true, points: pts };
  }

  // Normalisasi x dan y ke rentang 0 sampai 1 supaya preset berlaku sama untuk semua skenario.
  function makeNorm(points) {
    var pts = cleanPoints(points);
    var xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (var i = 0; i < pts.length; i++) {
      xMin = Math.min(xMin, pts[i].x); xMax = Math.max(xMax, pts[i].x);
      yMin = Math.min(yMin, pts[i].y); yMax = Math.max(yMax, pts[i].y);
    }
    var sx = xMax - xMin; if (!(sx > 0)) sx = 1;
    var sy = yMax - yMin; if (!(sy > 0)) sy = 1;
    var xs = [], ys = [];
    for (var j = 0; j < pts.length; j++) {
      xs.push((pts[j].x - xMin) / sx);
      ys.push((pts[j].y - yMin) / sy);
    }
    return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, sx: sx, sy: sy, xs: xs, ys: ys, n: pts.length };
  }

  // Error ternormalisasi: rata-rata kuadrat selisih.
  function lossNorm(norm, w, b) {
    var s = 0;
    for (var i = 0; i < norm.n; i++) {
      var r = w * norm.xs[i] + b - norm.ys[i];
      s += r * r;
    }
    return s / norm.n;
  }

  function gradNorm(norm, w, b) {
    var gw = 0, gb = 0;
    for (var i = 0; i < norm.n; i++) {
      var r = w * norm.xs[i] + b - norm.ys[i];
      gw += r * norm.xs[i];
      gb += r;
    }
    return { gw: 2 * gw / norm.n, gb: 2 * gb / norm.n };
  }

  // Ubah (w, b) ternormalisasi ke satuan asli.
  function toOriginal(norm, w, b) {
    var wo = norm.sy * w / norm.sx;
    var bo = norm.yMin + norm.sy * b - wo * norm.xMin;
    return { w: wo, b: bo };
  }

  function toNormalized(norm, wo, bo) {
    var w = wo * norm.sx / norm.sy;
    var b = (bo + wo * norm.xMin - norm.yMin) / norm.sy;
    return { w: w, b: b };
  }

  // Error dalam satuan asli (satuan y dikuadratkan).
  function lossToOriginal(norm, l) { return l * norm.sy * norm.sy; }

  function mseOriginal(points, wo, bo) {
    var pts = cleanPoints(points);
    var s = 0;
    for (var i = 0; i < pts.length; i++) {
      var r = wo * pts[i].x + bo - pts[i].y;
      s += r * r;
    }
    return s / pts.length;
  }

  // Jawaban terbaik pasti (kuadrat terkecil, rumus tertutup) dalam skala ternormalisasi.
  function leastSquares(norm) {
    var n = norm.n, mx = 0, my = 0;
    for (var i = 0; i < n; i++) { mx += norm.xs[i]; my += norm.ys[i]; }
    mx /= n; my /= n;
    var sxx = 0, sxy = 0;
    for (var j = 0; j < n; j++) {
      sxx += (norm.xs[j] - mx) * (norm.xs[j] - mx);
      sxy += (norm.xs[j] - mx) * (norm.ys[j] - my);
    }
    var w = sxx > 0 ? sxy / sxx : 0;
    var b = my - w * mx;
    return { w: w, b: b, loss: lossNorm(norm, w, b) };
  }

  // Nilai eigen terbesar dari Hessian error: H = 2 * [[mean(x^2), mean(x)], [mean(x), 1]].
  function hessianMaxEig(norm) {
    var mxx = 0, mx = 0;
    for (var i = 0; i < norm.n; i++) { mxx += norm.xs[i] * norm.xs[i]; mx += norm.xs[i]; }
    mxx /= norm.n; mx /= norm.n;
    var a = 2 * mxx, c = 2 * mx, d = 2;
    var tr = a + d, det = a * d - c * c;
    var disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
    return tr / 2 + disc;
  }

  // Tiga preset learning rate, dijamin merayap, konvergen, dan divergen di setiap data.
  function lrPresets(norm) {
    var lam = hessianMaxEig(norm);
    var crit = 2 / lam;
    return { kecil: 0.02 * crit, pas: 0.5 * crit, besar: 1.1 * crit, critical: crit, lambda: lam };
  }

  // Gradient descent dari titik awal tetap. Mengembalikan seluruh jejak untuk animasi.
  function runGD(norm, opts) {
    var lr = opts.lr, steps = Math.max(0, Math.floor(opts.steps));
    var start = opts.start || GD_START;
    var w = start.w, b = start.b;
    var l0 = lossNorm(norm, w, b);
    var path = [{ w: w, b: b, loss: l0 }];
    var limit = Math.max(50 * l0, 1);
    var diverged = false;
    var evals = 0;
    if (!isFinite(lr) || !isFinite(l0)) {
      return { path: path, w: w, b: b, loss: l0, evals: 0, diverged: true, lr: lr, steps: steps };
    }
    for (var k = 0; k < steps; k++) {
      var g = gradNorm(norm, w, b);
      evals++;
      var nw = w - lr * g.gw, nb = b - lr * g.gb;
      var nl = lossNorm(norm, nw, nb);
      if (!isFinite(nw) || !isFinite(nb) || !isFinite(nl) || nl > limit) {
        diverged = true;
        if (isFinite(nw) && isFinite(nb) && isFinite(nl)) path.push({ w: nw, b: nb, loss: nl });
        break;
      }
      w = nw; b = nb;
      path.push({ w: w, b: b, loss: nl });
    }
    var last = path[path.length - 1];
    return { path: path, w: last.w, b: last.b, loss: last.loss, evals: evals, diverged: diverged, lr: lr, steps: steps };
  }

  function clampInt(v, lo, hi) { v = Math.round(Number(v)); if (!isFinite(v)) v = lo; return Math.min(hi, Math.max(lo, v)); }

  // Algoritma genetika berkode real atas (w, b).
  // Seleksi turnamen, crossover blend (BLX-alpha), mutasi Gaussian, elitisme 1.
  function runGA(norm, opts) {
    var pop = clampInt(opts.pop, 2, 200);
    var gens = clampInt(opts.gens, 1, 500);
    var pm = Math.min(1, Math.max(0, Number(opts.mutation)));
    var seed = (opts.seed === undefined ? DEFAULT_SEED : opts.seed) >>> 0;
    var rng = mulberry32(seed);
    var box = GA_INIT_BOX;
    var individuals = [];
    for (var i = 0; i < pop; i++) {
      individuals.push({
        w: box.wMin + rng() * (box.wMax - box.wMin),
        b: box.bMin + rng() * (box.bMax - box.bMin)
      });
    }
    var evals = 0;
    function evaluate(list) {
      for (var j = 0; j < list.length; j++) { list[j].loss = lossNorm(norm, list[j].w, list[j].b); evals++; }
    }
    function bestOf(list) {
      var best = list[0];
      for (var j = 1; j < list.length; j++) if (list[j].loss < best.loss) best = list[j];
      return best;
    }
    function tournament(list) {
      var best = null;
      for (var t = 0; t < GA_TOURNAMENT; t++) {
        var c = list[Math.floor(rng() * list.length)];
        if (!best || c.loss < best.loss) best = c;
      }
      return best;
    }
    function blend(a, b) {
      var lo = Math.min(a, b), hi = Math.max(a, b), d = hi - lo;
      return lo - GA_ALPHA * d + rng() * (d + 2 * GA_ALPHA * d);
    }
    evaluate(individuals);
    var history = [];
    var snap = function (list) {
      var best = bestOf(list);
      history.push({
        points: list.map(function (p) { return { w: p.w, b: p.b, loss: p.loss }; }),
        best: { w: best.w, b: best.b, loss: best.loss }
      });
    };
    snap(individuals);
    for (var g = 1; g < gens; g++) {
      var elite = bestOf(individuals);
      var next = [{ w: elite.w, b: elite.b }];
      while (next.length < pop) {
        var p1 = tournament(individuals), p2 = tournament(individuals);
        var child = { w: blend(p1.w, p2.w), b: blend(p1.b, p2.b) };
        if (rng() < pm) child.w += GA_SIGMA * gaussian(rng);
        if (rng() < pm) child.b += GA_SIGMA * gaussian(rng);
        next.push(child);
      }
      individuals = next;
      evaluate(individuals);
      snap(individuals);
    }
    var final = history[history.length - 1].best;
    return { history: history, w: final.w, b: final.b, loss: final.loss, evals: evals, pop: pop, gens: gens, mutation: pm, seed: seed };
  }

  // Jalankan GA beberapa kali dengan seed base, base+1, ... dan hitung statistiknya.
  function runGAMany(norm, opts, times) {
    times = times || 5;
    var base = (opts.seed === undefined ? DEFAULT_SEED : opts.seed) >>> 0;
    var runs = [];
    for (var i = 0; i < times; i++) {
      var r = runGA(norm, { pop: opts.pop, gens: opts.gens, mutation: opts.mutation, seed: base + i });
      runs.push(r);
    }
    return { runs: runs, stats: runStats(runs.map(function (r) { return r.loss; })) };
  }

  // Statistik terbaik, terburuk, rata-rata.
  function runStats(losses) {
    if (!losses.length) return null;
    var best = Infinity, worst = -Infinity, sum = 0, bestIndex = 0;
    for (var i = 0; i < losses.length; i++) {
      if (losses[i] < best) { best = losses[i]; bestIndex = i; }
      if (losses[i] > worst) worst = losses[i];
      sum += losses[i];
    }
    return { best: best, worst: worst, mean: sum / losses.length, bestIndex: bestIndex };
  }

  // Selisih terhadap jawaban terbaik dalam persen. null jika jawaban terbaik bernilai nol.
  function gapPercent(loss, optimum) {
    if (!(optimum > 1e-12)) return null;
    return (loss - optimum) / optimum * 100;
  }

  // Format angka gaya Indonesia (koma desimal, titik ribuan).
  function formatNumber(v, decimals) {
    if (v === null || v === undefined || !isFinite(v)) return '-';
    if (decimals === undefined) decimals = 2;
    var neg = v < 0;
    var s = Math.abs(v).toFixed(decimals);
    var parts = s.split('.');
    var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    var out = parts.length > 1 ? intPart + ',' + parts[1] : intPart;
    if (neg && /[1-9]/.test(out)) out = '-' + out;
    return out;
  }

  // Pembulatan ramah: angka besar tanpa desimal, angka kecil dengan desimal seperlunya.
  function formatSmart(v) {
    if (!isFinite(v)) return '-';
    var a = Math.abs(v);
    var d = a >= 10 ? 0 : a >= 1 ? 1 : 2;
    var s = formatNumber(v, d);
    if (s.indexOf(',') >= 0) s = s.replace(/0+$/, '').replace(/,$/, '');
    return s === '-0' ? '0' : s;
  }

  // Angka error: pakai notasi yang tetap terbaca untuk nilai sangat besar atau sangat kecil.
  function formatError(v) {
    if (!isFinite(v)) return '-';
    var a = Math.abs(v);
    if (a !== 0 && (a >= 1e6 || a < 0.001)) {
      var e = Math.floor(Math.log10(a));
      var m = v / Math.pow(10, e);
      return formatNumber(m, 2) + ' x 10^' + e;
    }
    if (a >= 100) return formatNumber(v, 1);
    if (a >= 1) return formatNumber(v, 2);
    return formatNumber(v, 3);
  }

  // Terima "2,5" maupun "2.5". Mengembalikan null jika tidak valid.
  function parseNumber(text) {
    if (text === null || text === undefined) return null;
    var s = String(text).trim();
    if (s === '') return null;
    s = s.replace(/\s/g, '');
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return null;
    var v = Number(s);
    return isFinite(v) ? v : null;
  }

  function withUnit(value, unit) {
    return unit ? value + ' ' + unit : value;
  }

  // Kalimat prediksi dalam konteks skenario.
  function predictionSentence(scenario, model, xText, range) {
    var x = parseNumber(xText);
    if (xText === null || xText === undefined || String(xText).trim() === '') {
      return { ok: false, text: 'Silakan isi nilai ' + (scenario.xLabel || 'x') + ' terlebih dahulu.' };
    }
    if (x === null) {
      return { ok: false, text: 'Maaf, "' + String(xText).trim() + '" belum bisa dibaca sebagai angka. Contoh isian: 7 atau 2,5.' };
    }
    if (!model) {
      return { ok: false, text: 'Model belum dilatih. Jalankan GD atau GA terlebih dahulu.' };
    }
    var y = model.w * x + model.b;
    var xs = formatSmart(x), ys = formatSmart(y);
    var text = 'Untuk ' + (scenario.xLabel || 'x') + ' ' + withUnit(xs, scenario.xUnit) +
      ', perkiraan ' + (scenario.yLabel || 'y') + ' sekitar ' + withUnit(ys, scenario.yUnit) + '.';
    var notes = [];
    if (range && (x < range.xMin || x > range.xMax)) {
      notes.push('Catatan: nilai ini berada di luar rentang data (' + formatSmart(range.xMin) + ' sampai ' +
        formatSmart(range.xMax) + '), jadi perkiraannya kurang dapat diandalkan.');
    }
    if (y < 0 && scenario.nonNegative) {
      notes.push('Hasilnya negatif, padahal ' + (scenario.yLabel || 'y') + ' tidak mungkin negatif. Ini tanda garis lurus terlalu sederhana di daerah ini.');
    }
    return { ok: true, x: x, y: y, text: text, notes: notes };
  }

  return {
    SCENARIOS: SCENARIOS, GD_START: GD_START, GA_INIT_BOX: GA_INIT_BOX, DEFAULT_SEED: DEFAULT_SEED,
    mulberry32: mulberry32, cleanPoints: cleanPoints, validate: validate, makeNorm: makeNorm,
    lossNorm: lossNorm, gradNorm: gradNorm, toOriginal: toOriginal, toNormalized: toNormalized,
    lossToOriginal: lossToOriginal, mseOriginal: mseOriginal, leastSquares: leastSquares,
    hessianMaxEig: hessianMaxEig, lrPresets: lrPresets, runGD: runGD, runGA: runGA,
    runGAMany: runGAMany, runStats: runStats, gapPercent: gapPercent,
    formatNumber: formatNumber, formatSmart: formatSmart, formatError: formatError,
    parseNumber: parseNumber, predictionSentence: predictionSentence
  };
});
