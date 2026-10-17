/* Antarmuka Prediktor. Tanpa dependensi, tanpa permintaan jaringan.
   Bergantung pada window.Core dari core.js. */
(function () {
  'use strict';
  var C = window.Core;
  var STORAGE_KEY = 'prediktor-draft-v1';
  var MAX_ROWS = 12;
  var COLORS = { navy: '#0A2540', gold: '#F7B125', gd: '#e5484d', ga: '#16a39a', grid: '#e3e8ef', text: '#55657a', tryLine: '#8a96a8' };
  var GD_SPEED = [null, { delay: 260, adv: 1 }, { delay: 120, adv: 1 }, { delay: 50, adv: 1 }, { delay: 25, adv: 2 }, { delay: 16, adv: 6 }];
  var GA_SPEED = [null, { delay: 700, adv: 1 }, { delay: 380, adv: 1 }, { delay: 180, adv: 1 }, { delay: 90, adv: 1 }, { delay: 35, adv: 1 }];
  var SPEED_LABEL = [null, 'sangat pelan', 'pelan', 'sedang', 'cepat', 'kilat'];
  var MUT_PRESETS = { '0.05': 'Rendah', '0.3': 'Sedang', '0.8': 'Tinggi' };

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  var fmt = C.formatSmart, fmtErr = C.formatError;

  // ---------- Keadaan ----------
  function presetRows(id) {
    var sc = C.SCENARIOS.filter(function (s) { return s.id === id; })[0];
    return sc.points.map(function (p) { return { x: String(p.x).replace('.', ','), y: String(p.y).replace('.', ',') }; });
  }
  function blankCustomRows() {
    var rows = [];
    for (var i = 0; i < 6; i++) rows.push({ x: '', y: '' });
    return rows;
  }
  function defaultState() {
    var data = {};
    C.SCENARIOS.forEach(function (s) { data[s.id] = presetRows(s.id); });
    data.custom = blankCustomRows();
    return {
      scenarioId: C.SCENARIOS[0].id,
      data: data,
      custom: { name: 'Skenario kami', xLabel: 'x', xUnit: '', yLabel: 'y', yUnit: '' },
      gd: { preset: 'pas', lr: null, steps: 100, speed: 3 },
      ga: { pop: 20, gens: 30, mutation: 0.3, seed: C.DEFAULT_SEED },
      group: '',
      conclusion: '',
      predictions: [],
      present: false
    };
  }
  var state = defaultState();
  // Hasil latihan untuk data saat ini (tidak disimpan ke draft).
  var run = { gd: null, ga: null, gaMany: null, tryPoint: null, lastPred: null };
  var model = null; // { pts, norm, opt, presets, view, heatImage }
  var anim = null;

  function scenario() {
    if (state.scenarioId === 'custom') {
      var c = state.custom;
      return { id: 'custom', name: c.name || 'Skenario sendiri', xLabel: c.xLabel || 'x', xUnit: c.xUnit || '', yLabel: c.yLabel || 'y', yUnit: c.yUnit || '', nonNegative: false };
    }
    return C.SCENARIOS.filter(function (s) { return s.id === state.scenarioId; })[0];
  }
  function rows() { return state.data[state.scenarioId]; }
  function axisName(label, unit) { return unit ? label + ' (' + unit + ')' : label; }
  function errUnit() { var u = scenario().yUnit; return u ? ' ' + u + '²' : ''; }

  // ---------- Penyimpanan draft (opsional) ----------
  var saveTimer = null;
  function saveDraft() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        var copy = JSON.parse(JSON.stringify(state));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
      } catch (e) { /* penyimpanan tidak tersedia, abaikan */ }
    }, 300);
  }
  function loadDraft() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var d = JSON.parse(raw);
      var base = defaultState();
      if (d && typeof d === 'object') {
        if (d.data && typeof d.data === 'object') {
          Object.keys(base.data).forEach(function (k) {
            if (Array.isArray(d.data[k])) base.data[k] = d.data[k].slice(0, MAX_ROWS).map(function (r) { return { x: String(r.x || ''), y: String(r.y || '') }; });
          });
        }
        if (base.data[d.scenarioId]) base.scenarioId = d.scenarioId;
        if (d.custom) Object.keys(base.custom).forEach(function (k) { if (typeof d.custom[k] === 'string') base.custom[k] = d.custom[k]; });
        if (d.gd) { if (['kecil', 'pas', 'besar', null].indexOf(d.gd.preset) >= 0) base.gd.preset = d.gd.preset; ['lr', 'steps', 'speed'].forEach(function (k) { if (typeof d.gd[k] === 'number' && isFinite(d.gd[k])) base.gd[k] = d.gd[k]; }); }
        if (d.ga) ['pop', 'gens', 'mutation', 'seed'].forEach(function (k) { if (typeof d.ga[k] === 'number' && isFinite(d.ga[k])) base.ga[k] = d.ga[k]; });
        if (typeof d.group === 'string') base.group = d.group;
        if (typeof d.conclusion === 'string') base.conclusion = d.conclusion;
        if (Array.isArray(d.predictions)) base.predictions = d.predictions.slice(0, 3);
        base.present = !!d.present;
      }
      state = base;
      return true;
    } catch (e) { return false; }
  }
  function clearDraft() { try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* abaikan */ } }

  // ---------- Model dan data ----------
  function parsedPoints() {
    var out = [];
    rows().forEach(function (r) {
      var x = C.parseNumber(r.x), y = C.parseNumber(r.y);
      if (x !== null && y !== null) out.push({ x: x, y: y });
    });
    return out;
  }
  function rebuildModel() {
    var pts = parsedPoints();
    var v = C.validate(pts);
    if (!v.ok) { model = { pts: pts, invalid: v.message }; return; }
    var norm = C.makeNorm(pts);
    var opt = C.leastSquares(norm);
    var presets = C.lrPresets(norm);
    var hw = Math.max(2, 1.25 * Math.max(Math.abs(C.GD_START.w - opt.w), Math.abs(C.GD_START.b - opt.b)));
    var view = { wMin: opt.w - hw, wMax: opt.w + hw, bMin: opt.b - hw, bMax: opt.b + hw };
    model = { pts: pts, norm: norm, opt: opt, presets: presets, view: view, heatImage: null };
  }
  function invalidateRuns() {
    stopAnim();
    run.gd = null; run.ga = null; run.gaMany = null; run.tryPoint = null;
  }
  function currentLr() {
    if (state.gd.preset && model && model.presets) return model.presets[state.gd.preset];
    if (typeof state.gd.lr === 'number' && state.gd.lr > 0) return state.gd.lr;
    return model && model.presets ? model.presets.pas : 0.4;
  }
  function optOriginal() {
    var o = C.toOriginal(model.norm, model.opt.w, model.opt.b);
    return { w: o.w, b: o.b, loss: C.lossToOriginal(model.norm, model.opt.loss) };
  }
  function gaBest() {
    if (run.gaMany) return run.gaMany.runs[run.gaMany.stats.bestIndex];
    return run.ga ? run.ga.result : null;
  }
  function modelOf(kind) {
    if (!model || !model.norm) return null;
    if (kind === 'gd' && run.gd && !run.gd.result.diverged) {
      return C.toOriginal(model.norm, run.gd.result.w, run.gd.result.b);
    }
    if (kind === 'ga') { var g = gaBest(); if (g) return C.toOriginal(model.norm, g.w, g.b); }
    return null;
  }
  function anyRun() { return !!(run.gd || run.ga || run.gaMany); }

  // ---------- Kanvas ----------
  function setupCanvas(cv, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.max(50, Math.round(w)), H = Math.max(50, Math.round(h));
    if (cv.width !== W * dpr || cv.height !== H * dpr) {
      cv.width = W * dpr; cv.height = H * dpr;
    }
    cv.style.height = H + 'px';
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, W: W, H: H };
  }
  function niceTicks(min, max, count) {
    var span = max - min;
    if (!(span > 0)) return [min];
    var step0 = span / count, mag = Math.pow(10, Math.floor(Math.log10(step0))), n = step0 / mag;
    var step = (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
    var t = [], start = Math.ceil(min / step) * step;
    for (var v = start; v <= max + step * 1e-9; v += step) t.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return t;
  }
  function tickLabel(v) {
    var a = Math.abs(v);
    if (a >= 1000) return C.formatNumber(v, 0);
    if (a >= 10 || Number.isInteger(v)) return C.formatNumber(v, a % 1 === 0 ? 0 : 1);
    return C.formatNumber(v, a < 1 ? 2 : 1);
  }

  // Grafik data dan garis.
  var plotGeom = null;
  function plotRange() {
    var pts = model ? model.pts : [];
    var xMin, xMax, yMin, yMax;
    if (!pts.length) { xMin = 0; xMax = 10; yMin = 0; yMax = 10; }
    else {
      xMin = Infinity; xMax = -Infinity; yMin = Infinity; yMax = -Infinity;
      pts.forEach(function (p) { xMin = Math.min(xMin, p.x); xMax = Math.max(xMax, p.x); yMin = Math.min(yMin, p.y); yMax = Math.max(yMax, p.y); });
      if (run.lastPred && isFinite(run.lastPred.x)) {
        xMin = Math.min(xMin, run.lastPred.x); xMax = Math.max(xMax, run.lastPred.x);
        run.lastPred.ys.forEach(function (y) { if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); } });
      }
      var sx = xMax - xMin, sy = yMax - yMin;
      if (!(sx > 0)) sx = Math.max(1, Math.abs(xMin) * 0.2);
      if (!(sy > 0)) sy = Math.max(1, Math.abs(yMin) * 0.2);
      xMin -= sx * 0.1; xMax += sx * 0.1; yMin -= sy * 0.15; yMax += sy * 0.15;
    }
    return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax };
  }
  function drawPlot() {
    var cv = $('plot');
    var w = cv.parentNode.clientWidth;
    var h = Math.min(320, Math.max(220, w * 0.58));
    var c = setupCanvas(cv, w, h), ctx = c.ctx;
    var pad = { l: 52, r: 12, t: 12, b: 40 };
    var r = plotRange();
    var X = function (x) { return pad.l + (x - r.xMin) / (r.xMax - r.xMin) * (c.W - pad.l - pad.r); };
    var Y = function (y) { return c.H - pad.b - (y - r.yMin) / (r.yMax - r.yMin) * (c.H - pad.t - pad.b); };
    plotGeom = { pad: pad, r: r, W: c.W, H: c.H };
    ctx.clearRect(0, 0, c.W, c.H);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = COLORS.text; ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 1;
    niceTicks(r.xMin, r.xMax, 6).forEach(function (t) {
      var x = X(t); ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, c.H - pad.b); ctx.stroke();
      ctx.textAlign = 'center'; ctx.fillText(tickLabel(t), x, c.H - pad.b + 15);
    });
    niceTicks(r.yMin, r.yMax, 5).forEach(function (t) {
      var y = Y(t); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(c.W - pad.r, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(tickLabel(t), pad.l - 6, y + 4);
    });
    var sc = scenario();
    ctx.fillStyle = COLORS.navy; ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.fillText(axisName(sc.xLabel, sc.xUnit), pad.l + (c.W - pad.l - pad.r) / 2, c.H - 6);
    ctx.save(); ctx.translate(13, pad.t + (c.H - pad.t - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(axisName(sc.yLabel, sc.yUnit), 0, 0); ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.rect(pad.l, pad.t, c.W - pad.l - pad.r, c.H - pad.t - pad.b); ctx.clip();
    function line(m, color, width, dash) {
      if (!m || !isFinite(m.w) || !isFinite(m.b)) return;
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(X(r.xMin), Y(m.w * r.xMin + m.b)); ctx.lineTo(X(r.xMax), Y(m.w * r.xMax + m.b)); ctx.stroke();
      ctx.setLineDash([]);
    }
    if (model && model.norm) {
      if (run.tryPoint) line(C.toOriginal(model.norm, run.tryPoint.w, run.tryPoint.b), COLORS.tryLine, 2, [3, 3]);
      if (anyRun()) line(optOriginal(), COLORS.gold, 3, [8, 5]);
      var gdShown = gdDisplayPoint();
      if (gdShown) line(C.toOriginal(model.norm, gdShown.w, gdShown.b), COLORS.gd, 2.5);
      var gaShown = gaDisplayBest();
      if (gaShown) line(C.toOriginal(model.norm, gaShown.w, gaShown.b), COLORS.ga, 2.5);
    }
    ctx.restore();
    (model ? model.pts : []).forEach(function (p) {
      ctx.fillStyle = COLORS.navy; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });
    if (run.lastPred) {
      run.lastPred.ys.forEach(function (y, i) {
        if (!isFinite(y)) return;
        var px = X(run.lastPred.x), py = Y(y);
        ctx.strokeStyle = run.lastPred.colors[i]; ctx.fillStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(px, py - 7); ctx.lineTo(px + 7, py); ctx.lineTo(px, py + 7); ctx.lineTo(px - 7, py); ctx.closePath(); ctx.fill(); ctx.stroke();
      });
    }
    if (!model || !model.pts.length) {
      ctx.fillStyle = COLORS.text; ctx.font = '14px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Belum ada data. Klik di sini untuk menambah titik.', c.W / 2, c.H / 2);
    }
  }

  // Peta lanskap error.
  var heatGeom = null;
  function heatColor(t) {
    var stops = [[0, [255, 248, 230]], [0.18, [247, 210, 122]], [0.4, [224, 156, 58]], [0.7, [47, 111, 143]], [1, [10, 37, 64]]];
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i], u = (t - a[0]) / (b[0] - a[0]);
        return [a[1][0] + (b[1][0] - a[1][0]) * u, a[1][1] + (b[1][1] - a[1][1]) * u, a[1][2] + (b[1][2] - a[1][2]) * u];
      }
    }
    return stops[stops.length - 1][1];
  }
  function buildHeatImage() {
    var N = 120, v = model.view, norm = model.norm, opt = model.opt.loss;
    var vals = new Float64Array(N * N), maxE = 0;
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var w = v.wMin + (i + 0.5) / N * (v.wMax - v.wMin);
      var b = v.bMax - (j + 0.5) / N * (v.bMax - v.bMin);
      var e = Math.max(0, C.lossNorm(norm, w, b) - opt);
      vals[j * N + i] = e; if (e > maxE) maxE = e;
    }
    var s = maxE * 0.0015 + 1e-12, denom = Math.log(1 + maxE / s);
    var off = document.createElement('canvas'); off.width = N; off.height = N;
    var octx = off.getContext('2d'), img = octx.createImageData(N, N);
    for (var k = 0; k < N * N; k++) {
      var t = Math.log(1 + vals[k] / s) / denom;
      var col = heatColor(t);
      var band = (t * 12) % 1;
      var shade = band < 0.07 ? 0.9 : 1;
      img.data[k * 4] = col[0] * shade; img.data[k * 4 + 1] = col[1] * shade; img.data[k * 4 + 2] = col[2] * shade; img.data[k * 4 + 3] = 255;
    }
    octx.putImageData(img, 0, 0);
    model.heatImage = off;
  }
  function gdDisplayPoint() {
    if (!run.gd) return null;
    var path = run.gd.result.path;
    return path[Math.min(run.gd.shown, path.length - 1)];
  }
  function gaDisplayBest() {
    if (run.gaMany && !(anim && anim.type === 'ga')) return run.gaMany.runs[run.gaMany.stats.bestIndex];
    if (!run.ga) return null;
    var h = run.ga.result.history;
    return h[Math.min(run.ga.shown, h.length - 1)].best;
  }
  function drawHeat() {
    var cv = $('heat');
    var w = cv.parentNode.clientWidth;
    var maxH = window.innerWidth > 900 ? Math.max(240, window.innerHeight - 330) : w;
    var size = Math.min(w, maxH, 520);
    cv.style.width = size + 'px';
    var c = setupCanvas(cv, size, size), ctx = c.ctx;
    var pad = { l: 22, r: 6, t: 6, b: 22 };
    heatGeom = { pad: pad, W: c.W, H: c.H };
    ctx.clearRect(0, 0, c.W, c.H);
    if (!model || !model.norm) {
      ctx.fillStyle = '#eef1f6'; ctx.fillRect(0, 0, c.W, c.H);
      ctx.fillStyle = COLORS.text; ctx.font = '14px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Isi minimal 2 titik data', c.W / 2, c.H / 2 - 8);
      ctx.fillText('untuk melihat lanskap error.', c.W / 2, c.H / 2 + 12);
      return;
    }
    if (!model.heatImage) buildHeatImage();
    var v = model.view, iw = c.W - pad.l - pad.r, ih = c.H - pad.t - pad.b;
    var X = function (w) { return pad.l + (w - v.wMin) / (v.wMax - v.wMin) * iw; };
    var Y = function (b) { return pad.t + (v.bMax - b) / (v.bMax - v.bMin) * ih; };
    heatGeom.X = X; heatGeom.Y = Y; heatGeom.iw = iw; heatGeom.ih = ih;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(model.heatImage, pad.l, pad.t, iw, ih);
    ctx.fillStyle = COLORS.navy; ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('w (kemiringan) →', pad.l + iw / 2, c.H - 6);
    ctx.save(); ctx.translate(13, pad.t + ih / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('b (titik potong) →', 0, 0); ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.rect(pad.l, pad.t, iw, ih); ctx.clip();
    // Titik awal GD.
    ctx.strokeStyle = COLORS.navy; ctx.fillStyle = '#fff'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(X(C.GD_START.w), Y(C.GD_START.b), 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.navy; ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('awal', X(C.GD_START.w) + 10, Y(C.GD_START.b) + 4);
    // Coba-coba.
    if (run.tryPoint) {
      ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
      var tx = X(run.tryPoint.w), ty = Y(run.tryPoint.b);
      ctx.beginPath(); ctx.moveTo(tx - 6, ty - 6); ctx.lineTo(tx + 6, ty + 6); ctx.moveTo(tx + 6, ty - 6); ctx.lineTo(tx - 6, ty + 6); ctx.stroke();
    }
    // GA.
    var gaAnimating = anim && anim.type === 'ga';
    if (run.gaMany && !gaAnimating) {
      run.gaMany.runs.forEach(function (r, i) {
        var x = X(r.w), y = Y(r.b);
        ctx.fillStyle = COLORS.ga; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '700 10px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(i + 1), x, y + 3.5);
      });
    } else if (run.ga) {
      var hist = run.ga.result.history, g = Math.min(run.ga.shown, hist.length - 1);
      ctx.strokeStyle = COLORS.ga; ctx.lineWidth = 2; ctx.beginPath();
      for (var k = 0; k <= g; k++) { var bp = hist[k].best; if (k === 0) ctx.moveTo(X(bp.w), Y(bp.b)); else ctx.lineTo(X(bp.w), Y(bp.b)); }
      ctx.stroke();
      if (g > 0) {
        ctx.fillStyle = 'rgba(22,163,154,0.28)';
        hist[g - 1].points.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p.w), Y(p.b), 3, 0, Math.PI * 2); ctx.fill(); });
      }
      hist[g].points.forEach(function (p) {
        ctx.fillStyle = COLORS.ga; ctx.strokeStyle = COLORS.navy; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(X(p.w), Y(p.b), 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
    }
    // GD.
    if (run.gd) {
      var path = run.gd.result.path, n = Math.min(run.gd.shown, path.length - 1);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 5; ctx.beginPath();
      for (var s = 0; s <= n; s++) { if (s === 0) ctx.moveTo(X(path[s].w), Y(path[s].b)); else ctx.lineTo(X(path[s].w), Y(path[s].b)); }
      ctx.stroke();
      ctx.strokeStyle = COLORS.gd; ctx.lineWidth = 2.5; ctx.stroke();
      var cur = path[n];
      ctx.fillStyle = COLORS.gd; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(X(cur.w), Y(cur.b), 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // Bintang jawaban terbaik, setelah ada latihan.
    if (anyRun()) {
      var sx = X(model.opt.w), sy = Y(model.opt.b);
      drawStar(ctx, sx, sy, 11, 5);
      // Label di tepi bawah peta supaya tidak menutupi jejak GD dan GA.
      var label = 'jawaban terbaik (bisa dihitung karena modelnya kecil)';
      ctx.font = '600 11px system-ui, sans-serif';
      var tw = ctx.measureText(label).width;
      var lx = Math.min(Math.max(sx - tw / 2, pad.l + 4), pad.l + iw - tw - 4);
      var ly = sy > pad.t + ih * 0.7 ? pad.t + 18 : pad.t + ih - 8;
      ctx.strokeStyle = 'rgba(10,37,64,0.7)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(sx, sy + (ly > sy ? 12 : -12)); ctx.lineTo(sx, ly > sy ? ly - 12 : ly + 5); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(10,37,64,0.88)';
      roundRect(ctx, lx - 5, ly - 12, tw + 10, 17, 4); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(label, lx, ly);
    }
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function drawStar(ctx, x, y, R, spikes) {
    var r = R * 0.45;
    ctx.beginPath();
    for (var i = 0; i < spikes * 2; i++) {
      var rad = i % 2 === 0 ? R : r, a = -Math.PI / 2 + i * Math.PI / spikes;
      if (i === 0) ctx.moveTo(x + rad * Math.cos(a), y + rad * Math.sin(a)); else ctx.lineTo(x + rad * Math.cos(a), y + rad * Math.sin(a));
    }
    ctx.closePath();
    ctx.fillStyle = COLORS.gold; ctx.strokeStyle = COLORS.navy; ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
  }

  // Grafik error terhadap iterasi (skala log).
  function drawLoss() {
    var cv = $('lossChart');
    var w = cv.parentNode.clientWidth;
    var c = setupCanvas(cv, w, 130), ctx = c.ctx;
    ctx.clearRect(0, 0, c.W, c.H);
    var pad = { l: 52, r: 10, t: 10, b: 28 };
    var series = [];
    if (model && model.norm) {
      var toO = function (l) { return C.lossToOriginal(model.norm, l); };
      if (run.gd) series.push({ color: COLORS.gd, pts: run.gd.result.path.slice(0, run.gd.shown + 1).map(function (p) { return toO(p.loss); }), width: 2.5 });
      var gaAnimating = anim && anim.type === 'ga';
      if (run.gaMany && !gaAnimating) {
        run.gaMany.runs.forEach(function (r, i) {
          series.push({ color: i === run.gaMany.stats.bestIndex ? COLORS.ga : 'rgba(22,163,154,0.35)', pts: r.history.map(function (h) { return toO(h.best.loss); }), width: i === run.gaMany.stats.bestIndex ? 2.5 : 1.5 });
        });
      } else if (run.ga) {
        series.push({ color: COLORS.ga, pts: run.ga.result.history.slice(0, run.ga.shown + 1).map(function (h) { return toO(h.best.loss); }), width: 2.5 });
      }
    }
    ctx.font = '12px system-ui, sans-serif';
    if (!series.length) {
      ctx.fillStyle = COLORS.text; ctx.textAlign = 'center';
      ctx.fillText('Grafik error per iterasi muncul setelah latihan.', c.W / 2, c.H / 2 + 4);
      return;
    }
    var optL = optOriginal().loss;
    var maxIt = 1, lo = Infinity, hi = -Infinity;
    series.forEach(function (s) {
      maxIt = Math.max(maxIt, s.pts.length - 1);
      s.pts.forEach(function (v) { if (v > 0 && isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } });
    });
    if (optL > 0) lo = Math.min(lo, optL);
    if (!isFinite(lo)) { lo = 1e-3; hi = 1; }
    var L0 = Math.log10(lo) - 0.1, L1 = Math.log10(Math.max(hi, lo * 1.01)) + 0.1;
    var X = function (i) { return pad.l + i / maxIt * (c.W - pad.l - pad.r); };
    var Y = function (v) { var lv = Math.log10(Math.max(v, Math.pow(10, L0))); return c.H - pad.b - (lv - L0) / (L1 - L0) * (c.H - pad.t - pad.b); };
    ctx.strokeStyle = COLORS.grid; ctx.fillStyle = COLORS.text; ctx.lineWidth = 1;
    for (var e = Math.ceil(L0); e <= Math.floor(L1); e++) {
      var y = Y(Math.pow(10, e)); ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(c.W - pad.r, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(e >= 6 || e < -3 ? '10^' + e : C.formatNumber(Math.pow(10, e), Math.max(0, -e)), pad.l - 5, y + 4);
    }
    ctx.textAlign = 'center';
    ctx.fillText('iterasi (langkah GD atau generasi GA)', pad.l + (c.W - pad.l - pad.r) / 2, c.H - 6);
    ctx.save(); ctx.translate(11, pad.t + (c.H - pad.t - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('error', 0, 0); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(pad.l, pad.t, c.W - pad.l - pad.r, c.H - pad.t - pad.b); ctx.clip();
    if (optL > 0) {
      ctx.strokeStyle = COLORS.gold; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(pad.l, Y(optL)); ctx.lineTo(c.W - pad.r, Y(optL)); ctx.stroke(); ctx.setLineDash([]);
    }
    series.forEach(function (s) {
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width; ctx.beginPath();
      s.pts.forEach(function (v, i) { if (i === 0) ctx.moveTo(X(i), Y(v)); else ctx.lineTo(X(i), Y(v)); });
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawAll() { drawPlot(); drawHeat(); drawLoss(); }

  // ---------- Animasi ----------
  function stopAnim() {
    if (anim) { clearTimeout(anim.timer); anim = null; }
  }
  function startAnim(type, total, target, speedTable, onDone) {
    stopAnim();
    anim = { type: type, total: total, target: target, onDone: onDone, timer: null };
    var tick = function () {
      if (!anim) return;
      var sp = speedTable[state.gd.speed] || speedTable[3];
      target.shown = Math.min(total, target.shown + sp.adv);
      drawAll();
      if (target.shown >= total) { var done = anim.onDone; anim = null; drawAll(); done(); return; }
      anim.timer = setTimeout(tick, sp.delay);
    };
    anim.timer = setTimeout(tick, 0);
  }
  function finishAnim() {
    if (!anim) return false;
    var a = anim;
    a.target.shown = a.total;
    clearTimeout(a.timer); anim = null;
    drawAll(); a.onDone();
    return true;
  }

  // ---------- Latihan ----------
  function requireModel() {
    if (!model || !model.norm) {
      toast(model && model.invalid ? model.invalid : 'Data belum cukup untuk dilatih.');
      return false;
    }
    return true;
  }
  function trainGD(instant) {
    if (!requireModel()) return;
    if (anim && anim.type === 'gd' && instant) { finishAnim(); return; }
    var lr = currentLr();
    var res = C.runGD(model.norm, { lr: lr, steps: state.gd.steps });
    run.gd = { result: res, shown: 0, preset: state.gd.preset };
    run.lastPred = null;
    $('gdWarn').textContent = '';
    $('gdResult').textContent = 'Melatih...';
    var total = res.path.length - 1;
    if (instant) { run.gd.shown = total; drawAll(); gdDone(); }
    else startAnim('gd', total, run.gd, GD_SPEED, gdDone);
  }
  function gdDone() {
    renderGDResult();
    renderEvalCompare();
    renderKartu();
    drawAll();
  }
  function renderGDResult() {
    var box = $('gdResult');
    box.textContent = '';
    if (!run.gd) return;
    var r = run.gd.result, o = C.toOriginal(model.norm, r.w, r.b);
    var opt = optOriginal(), loss = C.lossToOriginal(model.norm, r.loss);
    if (r.diverged) {
      $('gdWarn').textContent = 'Error membesar, langkah terlalu jauh. Coba learning rate yang lebih kecil.';
      appendLine(box, 'GD dihentikan setelah ' + r.evals + ' langkah karena error terus membesar.');
      appendLine(box, 'Evaluasi error: ' + r.evals + '.');
      return;
    }
    var gap = C.gapPercent(r.loss, model.opt.loss);
    appendLine(box, 'Error akhir: ' + fmtErr(loss) + errUnit() + (gap === null ? '' : ' (selisih ' + C.formatNumber(gap, gap < 10 ? 2 : 0) + '% dari jawaban terbaik)') + '.', true);
    appendLine(box, 'Garis: y = ' + fmt(o.w) + '·x ' + signed(o.b) + '. Evaluasi error: ' + r.evals + '.');
    if (gap !== null && gap > 10) appendLine(box, 'Belum sampai lembah. Tambah langkah atau perbesar learning rate.');
  }
  function signed(v) { return v < 0 ? '- ' + fmt(-v) : '+ ' + fmt(v); }
  function appendLine(box, text, strong) { var p = el('p', null, text); if (strong) p.style.fontWeight = '700'; box.appendChild(p); }

  function gaOpts() { return { pop: state.ga.pop, gens: state.ga.gens, mutation: state.ga.mutation, seed: state.ga.seed }; }
  function trainGA(instant) {
    if (!requireModel()) return;
    if (anim && anim.type === 'ga' && instant) { finishAnim(); return; }
    var res = C.runGA(model.norm, gaOpts());
    run.ga = { result: res, shown: 0 };
    run.gaMany = null;
    run.lastPred = null;
    $('gaManyBox').textContent = '';
    $('gaResult').textContent = 'Menjalankan generasi...';
    var total = res.history.length - 1;
    if (instant) { run.ga.shown = total; drawAll(); gaDone(); }
    else startAnim('ga', total, run.ga, GA_SPEED, gaDone);
  }
  function gaDone() { renderGAResult(); renderEvalCompare(); renderKartu(); drawAll(); }
  function renderGAResult() {
    var box = $('gaResult');
    box.textContent = '';
    if (!run.ga) return;
    var r = run.ga.result, o = C.toOriginal(model.norm, r.w, r.b);
    var gap = C.gapPercent(r.loss, model.opt.loss);
    appendLine(box, 'Error terbaik generasi terakhir: ' + fmtErr(C.lossToOriginal(model.norm, r.loss)) + errUnit() + (gap === null ? '' : ' (selisih ' + C.formatNumber(gap, 2) + '% dari jawaban terbaik)') + '.', true);
    appendLine(box, 'Garis: y = ' + fmt(o.w) + '·x ' + signed(o.b) + '. Seed ' + r.seed + '. Evaluasi error: ' + r.pop + ' x ' + r.gens + ' = ' + r.evals + '.');
  }
  function trainGAMany() {
    if (!requireModel()) return;
    stopAnim();
    run.gaMany = C.runGAMany(model.norm, gaOpts(), 5);
    run.ga = { result: run.gaMany.runs[0], shown: run.gaMany.runs[0].history.length - 1 };
    run.lastPred = null;
    renderGAResult();
    renderGAMany();
    renderEvalCompare();
    renderKartu();
    drawAll();
  }
  function renderGAMany() {
    var box = $('gaManyBox');
    box.textContent = '';
    if (!run.gaMany) return;
    var m = run.gaMany, norm = model.norm, optL = model.opt.loss;
    var wrap = el('div', { 'class': 'table-scroll' });
    var t = el('table', { id: 'gaManyTable' });
    t.style.marginTop = '8px';
    var head = el('tr');
    ['Jalan', 'Seed', 'Error', 'w', 'b', 'Evaluasi', 'Selisih'].forEach(function (h, i) { head.appendChild(el('th', i >= 2 ? { 'class': 'num' } : null, h)); });
    var thead = el('thead'); thead.appendChild(head); t.appendChild(thead);
    var tb = el('tbody');
    m.runs.forEach(function (r, i) {
      var o = C.toOriginal(norm, r.w, r.b), gap = C.gapPercent(r.loss, optL);
      var tr = el('tr', i === m.stats.bestIndex ? { 'class': 'best' } : null);
      [String(i + 1), String(r.seed), fmtErr(C.lossToOriginal(norm, r.loss)), fmt(o.w), fmt(o.b), String(r.evals), gap === null ? '-' : C.formatNumber(gap, 2) + '%']
        .forEach(function (v, j) { tr.appendChild(el('td', j >= 2 ? { 'class': 'num' } : null, v)); });
      tb.appendChild(tr);
    });
    [['Terbaik', m.stats.best], ['Terburuk', m.stats.worst], ['Rata-rata', m.stats.mean]].forEach(function (row) {
      var gap = C.gapPercent(row[1], optL);
      var tr = el('tr', { 'class': 'stat' });
      tr.appendChild(el('td', { colspan: '2' }, row[0]));
      tr.appendChild(el('td', { 'class': 'num' }, fmtErr(C.lossToOriginal(norm, row[1]))));
      tr.appendChild(el('td', { colspan: '3' }, ''));
      tr.appendChild(el('td', { 'class': 'num' }, gap === null ? '-' : C.formatNumber(gap, 2) + '%'));
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); box.appendChild(wrap);
    box.appendChild(el('p', { 'class': 'muted small' }, 'Jawaban terbaik dari rumus: error ' + fmtErr(optOriginal().loss) + errUnit() + '. Selisih = seberapa persen error GA lebih besar dari jawaban terbaik. Baris emas adalah jalan terbaik, dipakai untuk prediksi "GA terbaik".'));
  }
  function renderEvalCompare() {
    var parts = [];
    if (run.gd) parts.push('GD ' + run.gd.result.evals + ' (satu per langkah)');
    var g = run.ga ? run.ga.result : null;
    if (g) parts.push('GA ' + g.pop + ' x ' + g.gens + ' = ' + g.evals + (run.gaMany ? ' per jalan' : ''));
    $('evalCompare').textContent = parts.length ? 'Jumlah evaluasi error: ' + parts.join(', ') + '.' : '';
    var info = $('optInfo');
    if (model && model.norm && anyRun()) {
      var o = optOriginal();
      info.textContent = 'Jawaban terbaik (rumus pasti): y = ' + fmt(o.w) + '·x ' + signed(o.b) + ', error ' + fmtErr(o.loss) + errUnit() + '.';
    } else info.textContent = '';
  }

  // ---------- Prediksi ----------
  function predict(ev) {
    if (ev) ev.preventDefault();
    var out = $('predOut');
    out.textContent = '';
    var sc = scenario(), text = $('predInput').value;
    var choice = $('predModel').value;
    var kinds = choice === 'both' ? ['gd', 'ga'] : [choice];
    var avail = kinds.filter(function (k) { return modelOf(k); });
    if (!avail.length) {
      var any = ['gd', 'ga'].filter(function (k) { return modelOf(k); });
      var msg;
      if (!model || !model.norm) msg = 'Data belum cukup. Isi minimal 2 titik data, lalu latih model.';
      else if (run.gd && run.gd.result.diverged && !gaBest()) msg = 'Model GD berhenti karena error membesar. Latih ulang dengan learning rate yang lebih kecil, atau jalankan GA.';
      else if (any.length) msg = 'Model ' + (choice === 'gd' ? 'GD' : 'GA') + ' belum ada. Pilih "Keduanya" atau latih model itu terlebih dahulu.';
      else msg = 'Model belum dilatih. Jalankan GD atau GA terlebih dahulu.';
      out.appendChild(el('p', { 'class': 'pred-note' }, msg));
      return;
    }
    var range = { xMin: model.norm.xMin, xMax: model.norm.xMax };
    var record = { x: null, items: [] };
    var notes = [];
    var lp = { x: null, ys: [], colors: [] };
    for (var i = 0; i < avail.length; i++) {
      var k = avail[i], m = modelOf(k);
      var r = C.predictionSentence(sc, m, text, range);
      if (!r.ok) { out.appendChild(el('p', { 'class': 'pred-note' }, r.text)); return; }
      var p = el('p', { 'class': 'pred-line' });
      p.appendChild(el('span', { 'class': 'sw ' + (k === 'gd' ? 'sw-gd' : 'sw-ga') }));
      p.appendChild(document.createTextNode(' ' + (k === 'gd' ? 'GD' : 'GA terbaik') + ': ' + r.text));
      out.appendChild(p);
      if (!notes.length) notes = r.notes;
      record.x = r.x; record.items.push({ model: k, y: r.y, text: r.text });
      lp.x = r.x; lp.ys.push(r.y); lp.colors.push(k === 'gd' ? COLORS.gd : COLORS.ga);
    }
    notes.forEach(function (n) { out.appendChild(el('p', { 'class': 'pred-note' }, n)); });
    var missing = kinds.filter(function (k) { return avail.indexOf(k) < 0; });
    if (missing.length && choice === 'both') out.appendChild(el('p', { 'class': 'muted small' }, 'Model ' + (missing[0] === 'gd' ? 'GD' : 'GA') + ' belum ada, jadi hanya satu model yang menjawab.'));
    run.lastPred = lp;
    state.predictions = [record].concat(state.predictions.filter(function (q) { return q.x !== record.x; })).slice(0, 3);
    saveDraft(); renderKartu(); drawPlot();
  }

  // ---------- Kartu Hasil ----------
  function kartuData() {
    var sc = scenario(), d = { sc: sc, group: state.group.trim(), n: model ? model.pts.length : 0 };
    if (model && model.norm) d.opt = optOriginal();
    if (run.gd && model && model.norm) {
      var r = run.gd.result;
      d.gd = { lr: r.lr, steps: r.steps, preset: run.gd.preset, diverged: r.diverged, evals: r.evals, loss: C.lossToOriginal(model.norm, r.loss), gap: C.gapPercent(r.loss, model.opt.loss) };
    }
    if (run.gaMany) {
      var s = run.gaMany.stats, r0 = run.gaMany.runs[0];
      d.ga5 = { pop: r0.pop, gens: r0.gens, mutation: r0.mutation, seed: r0.seed, evals: r0.evals,
        best: C.lossToOriginal(model.norm, s.best), worst: C.lossToOriginal(model.norm, s.worst), mean: C.lossToOriginal(model.norm, s.mean),
        gapBest: C.gapPercent(s.best, model.opt.loss), gapWorst: C.gapPercent(s.worst, model.opt.loss) };
    } else if (run.ga) {
      var g = run.ga.result;
      d.ga1 = { pop: g.pop, gens: g.gens, mutation: g.mutation, seed: g.seed, evals: g.evals, loss: C.lossToOriginal(model.norm, g.loss), gap: C.gapPercent(g.loss, model.opt.loss) };
    }
    d.preds = state.predictions;
    d.conclusion = state.conclusion.trim();
    return d;
  }
  function pct(v) { return v === null || v === undefined ? '-' : C.formatNumber(v, 2) + '%'; }
  function lrName(p) { return p === 'kecil' ? ' (Terlalu kecil)' : p === 'pas' ? ' (Pas)' : p === 'besar' ? ' (Terlalu besar)' : ''; }
  function mutName(m) { var k = String(m); return MUT_PRESETS[k] ? ' (' + MUT_PRESETS[k] + ')' : ''; }
  function kartuLines() {
    var d = kartuData(), u = errUnit(), L = [];
    L.push('PREDIKTOR, Kartu Hasil Kelompok ' + (d.group || '-'));
    L.push('Computing Laboratory, FORTRAN 2026');
    L.push('Skenario: ' + d.sc.name + ' (' + axisName(d.sc.xLabel, d.sc.xUnit) + ' terhadap ' + axisName(d.sc.yLabel, d.sc.yUnit) + ')');
    L.push('Jumlah data: ' + d.n + ' titik');
    if (d.gd) {
      L.push('GD: learning rate ' + C.formatNumber(d.gd.lr, 4) + lrName(d.gd.preset) + ', ' + d.gd.steps + ' langkah');
      L.push(d.gd.diverged ? '  Berhenti karena error membesar (langkah terlalu jauh), ' + d.gd.evals + ' evaluasi' : '  Error akhir ' + fmtErr(d.gd.loss) + u + ', selisih ' + pct(d.gd.gap) + ', ' + d.gd.evals + ' evaluasi');
    } else L.push('GD: belum dijalankan');
    if (d.ga5) {
      L.push('GA 5 kali: populasi ' + d.ga5.pop + ', generasi ' + d.ga5.gens + ', mutasi ' + C.formatNumber(d.ga5.mutation, 2) + mutName(d.ga5.mutation) + ', seed ' + d.ga5.seed + ' sampai ' + (d.ga5.seed + 4));
      L.push('  Terbaik ' + fmtErr(d.ga5.best) + u + ' (selisih ' + pct(d.ga5.gapBest) + '), terburuk ' + fmtErr(d.ga5.worst) + u + ' (selisih ' + pct(d.ga5.gapWorst) + '), rata-rata ' + fmtErr(d.ga5.mean) + u);
      L.push('  ' + d.ga5.evals + ' evaluasi per jalan');
    } else if (d.ga1) {
      L.push('GA 1 kali: populasi ' + d.ga1.pop + ', generasi ' + d.ga1.gens + ', mutasi ' + C.formatNumber(d.ga1.mutation, 2) + ', seed ' + d.ga1.seed);
      L.push('  Error ' + fmtErr(d.ga1.loss) + u + ', selisih ' + pct(d.ga1.gap) + ', ' + d.ga1.evals + ' evaluasi');
    } else L.push('GA: belum dijalankan');
    if (d.opt && anyRun()) L.push('Jawaban terbaik (rumus): error ' + fmtErr(d.opt.loss) + u);
    if (d.preds.length) {
      L.push('Prediksi:');
      d.preds.forEach(function (p) { p.items.forEach(function (it) { L.push('  ' + (it.model === 'gd' ? 'GD' : 'GA') + ': ' + it.text); }); });
    }
    L.push('Kesimpulan: ' + (d.conclusion || '-'));
    return L;
  }
  function renderKartu() {
    var d = kartuData(), u = errUnit(), card = $('hasilCard');
    card.textContent = '';
    var head = el('div', { 'class': 'hasil-head' });
    head.appendChild(el('strong', null, 'Kelompok ' + (d.group || '...')));
    head.appendChild(el('span', null, 'Prediktor · ' + d.sc.name));
    card.appendChild(head);
    var body = el('div', { 'class': 'hasil-body' });
    function section(title, lines) {
      var s = el('div'); s.appendChild(el('h4', null, title));
      lines.forEach(function (l) { s.appendChild(el('p', null, l)); });
      body.appendChild(s);
    }
    section('Data', [axisName(d.sc.xLabel, d.sc.xUnit) + ' terhadap ' + axisName(d.sc.yLabel, d.sc.yUnit), d.n + ' titik data']
      .concat(d.opt && anyRun() ? ['Jawaban terbaik (rumus): error ' + fmtErr(d.opt.loss) + u] : []));
    if (d.gd) section('Gradient Descent', ['Learning rate ' + C.formatNumber(d.gd.lr, 4) + lrName(d.gd.preset) + ', ' + d.gd.steps + ' langkah',
      d.gd.diverged ? 'Berhenti: error membesar' : 'Error akhir ' + fmtErr(d.gd.loss) + u + ' (selisih ' + pct(d.gd.gap) + ')', d.gd.evals + ' evaluasi']);
    else section('Gradient Descent', ['Belum dijalankan']);
    if (d.ga5) section('Algoritma Genetika, 5 kali', ['Populasi ' + d.ga5.pop + ', generasi ' + d.ga5.gens + ', mutasi ' + C.formatNumber(d.ga5.mutation, 2) + mutName(d.ga5.mutation),
      'Terbaik ' + fmtErr(d.ga5.best) + u + ' (' + pct(d.ga5.gapBest) + ')', 'Terburuk ' + fmtErr(d.ga5.worst) + u + ' (' + pct(d.ga5.gapWorst) + ')', 'Rata-rata ' + fmtErr(d.ga5.mean) + u, d.ga5.evals + ' evaluasi per jalan']);
    else if (d.ga1) section('Algoritma Genetika, 1 kali', ['Populasi ' + d.ga1.pop + ', generasi ' + d.ga1.gens, 'Error ' + fmtErr(d.ga1.loss) + u + ' (' + pct(d.ga1.gap) + ')', d.ga1.evals + ' evaluasi', 'Klik "Jalankan 5 kali" untuk tabel lengkap']);
    else section('Algoritma Genetika', ['Belum dijalankan']);
    var ps = el('div'); ps.appendChild(el('h4', null, 'Prediksi'));
    if (d.preds.length) {
      var ul = el('ul');
      d.preds.forEach(function (p) { p.items.forEach(function (it) { ul.appendChild(el('li', null, (it.model === 'gd' ? 'GD: ' : 'GA: ') + it.text)); }); });
      ps.appendChild(ul);
    } else ps.appendChild(el('p', null, 'Belum ada prediksi'));
    body.appendChild(ps);
    var k = el('div', { 'class': 'hasil-kesimpulan' });
    k.appendChild(el('h4', null, 'Kesimpulan kelompok'));
    k.appendChild(el('p', null, d.conclusion || 'Tulis satu kalimat kesimpulan di kolom sebelah kiri.'));
    body.appendChild(k);
    card.appendChild(body);
    card.appendChild(el('div', { 'class': 'hasil-foot' }, 'Computing Laboratory · FORTRAN 2026 · Dua Cara Belajar'));
  }
  function copySummary() {
    var text = kartuLines().join('\n');
    var fb = $('copyFallback');
    function fallback() {
      fb.hidden = false; fb.value = text; fb.focus(); fb.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      toast(ok ? 'Ringkasan disalin.' : 'Salin teks di kotak ringkasan secara manual.');
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { fb.hidden = true; toast('Ringkasan disalin.'); }, fallback);
        return;
      }
    } catch (e) { /* lanjut ke cara cadangan */ }
    fallback();
  }

  // ---------- Tampilan kontrol ----------
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function syncControls() {
    var lr = currentLr();
    $('lrSlider').value = String(Math.log10(lr));
    $('lrOut').textContent = C.formatNumber(lr, lr < 0.1 ? 4 : 3);
    document.querySelectorAll('[data-lr]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lr') === state.gd.preset)); });
    $('stepsSlider').value = String(state.gd.steps); $('stepsOut').textContent = String(state.gd.steps);
    $('speedSlider').value = String(state.gd.speed); $('speedOut').textContent = SPEED_LABEL[state.gd.speed];
    $('popSlider').value = String(state.ga.pop); $('popOut').textContent = String(state.ga.pop);
    $('genSlider').value = String(state.ga.gens); $('genOut').textContent = String(state.ga.gens);
    $('mutSlider').value = String(state.ga.mutation); $('mutOut').textContent = C.formatNumber(state.ga.mutation, 2);
    document.querySelectorAll('[data-mut]').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-mut')) === state.ga.mutation)); });
    $('seedInput').value = String(state.ga.seed);
    var present = state.present;
    document.body.classList.toggle('present', present);
    $('btnPresent').setAttribute('aria-pressed', String(present));
    $('btnPresent2').setAttribute('aria-pressed', String(present));
  }
  function renderScenario() {
    var sel = $('scenarioSelect');
    if (!sel.options.length) {
      C.SCENARIOS.forEach(function (s) { sel.appendChild(el('option', { value: s.id }, s.name)); });
      sel.appendChild(el('option', { value: 'custom' }, 'Skenario sendiri'));
    }
    sel.value = state.scenarioId;
    var isCustom = state.scenarioId === 'custom';
    $('customFields').hidden = !isCustom;
    if (isCustom) {
      $('cName').value = state.custom.name; $('cXLabel').value = state.custom.xLabel; $('cXUnit').value = state.custom.xUnit;
      $('cYLabel').value = state.custom.yLabel; $('cYUnit').value = state.custom.yUnit;
    }
    renderLabels();
  }
  function renderLabels() {
    var sc = scenario();
    $('thX').textContent = 'x: ' + axisName(sc.xLabel, sc.xUnit);
    $('thY').textContent = 'y: ' + axisName(sc.yLabel, sc.yUnit);
    $('predLabel').textContent = 'Nilai ' + axisName(sc.xLabel, sc.xUnit);
  }
  function renderTable() {
    var tb = document.querySelector('#dataTable tbody');
    tb.textContent = '';
    rows().forEach(function (r, i) {
      var tr = el('tr');
      tr.appendChild(el('td', null, String(i + 1)));
      ['x', 'y'].forEach(function (key) {
        var td = el('td');
        var inp = el('input', { type: 'text', inputmode: 'decimal', 'aria-label': key + ' baris ' + (i + 1), 'data-row': String(i), 'data-key': key });
        inp.value = r[key];
        td.appendChild(inp); tr.appendChild(td);
      });
      var td = el('td');
      var del = el('button', { type: 'button', 'class': 'btn-del', 'data-del': String(i), 'aria-label': 'Hapus baris ' + (i + 1) }, 'Hapus');
      td.appendChild(del); tr.appendChild(td);
      tb.appendChild(tr);
    });
    $('btnAddRow').disabled = rows().length >= MAX_ROWS;
    renderDataStatus();
  }
  function renderDataStatus() {
    var valid = parsedPoints().length, total = rows().length;
    $('dataCount').textContent = valid + ' titik valid dari ' + total + ' baris. Disarankan 6 sampai 10 titik.';
    var warn = '';
    var bad = rows().filter(function (r) { return (r.x.trim() !== '' || r.y.trim() !== '') && (C.parseNumber(r.x) === null || C.parseNumber(r.y) === null); }).length;
    if (bad) warn = bad + ' baris belum lengkap atau bukan angka, jadi tidak dipakai. Contoh isian: 7 atau 2,5.';
    if (model && model.invalid) warn = (warn ? warn + ' ' : '') + model.invalid;
    $('dataWarn').textContent = warn;
  }

  // Dipanggil setiap kali data berubah.
  function dataChanged(opts) {
    rebuildModel();
    invalidateRuns();
    state.predictions = [];
    run.lastPred = null;
    $('gdResult').textContent = ''; $('gdWarn').textContent = ''; $('gaResult').textContent = ''; $('gaManyBox').textContent = '';
    $('predOut').textContent = '';
    if (!opts || !opts.keepTable) renderTable(); else renderDataStatus();
    syncControls(); renderEvalCompare(); renderKartu(); drawAll(); saveDraft();
  }
  function renderAll() {
    renderScenario(); renderTable(); syncControls(); renderEvalCompare(); renderKartu();
    $('groupInput').value = state.group; $('conclusionInput').value = state.conclusion;
    drawAll();
  }

  // ---------- Peristiwa ----------
  function bind() {
    // Tab.
    var tabs = ['praktik', 'panduan', 'pseudocode', 'tentang'];
    tabs.forEach(function (name) {
      $('tab-' + name).addEventListener('click', function () { showTab(name); });
    });
    $('tab-praktik').parentNode.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var cur = tabs.indexOf(document.activeElement.id.replace('tab-', ''));
      if (cur < 0) return;
      var next = (cur + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      showTab(tabs[next]); $('tab-' + tabs[next]).focus();
    });
    function togglePresent() { state.present = !state.present; syncControls(); saveDraft(); setTimeout(drawAll, 50); }
    $('btnPresent').addEventListener('click', togglePresent);
    $('btnPresent2').addEventListener('click', togglePresent);

    $('scenarioSelect').addEventListener('change', function () {
      state.scenarioId = this.value; renderScenario(); dataChanged();
    });
    ['cName', 'cXLabel', 'cXUnit', 'cYLabel', 'cYUnit'].forEach(function (id) {
      $(id).addEventListener('input', function () {
        var key = { cName: 'name', cXLabel: 'xLabel', cXUnit: 'xUnit', cYLabel: 'yLabel', cYUnit: 'yUnit' }[id];
        state.custom[key] = this.value; renderLabels(); renderKartu(); drawPlot(); saveDraft();
      });
    });
    var tbody = document.querySelector('#dataTable tbody');
    tbody.addEventListener('input', function (e) {
      var t = e.target; if (!t.hasAttribute('data-row')) return;
      rows()[Number(t.getAttribute('data-row'))][t.getAttribute('data-key')] = t.value;
      dataChanged({ keepTable: true });
    });
    tbody.addEventListener('click', function (e) {
      var t = e.target; if (!t.hasAttribute('data-del')) return;
      rows().splice(Number(t.getAttribute('data-del')), 1); dataChanged();
    });
    $('btnAddRow').addEventListener('click', function () {
      if (rows().length >= MAX_ROWS) return;
      rows().push({ x: '', y: '' }); dataChanged();
      var inputs = document.querySelectorAll('#dataTable tbody input'); if (inputs.length) inputs[inputs.length - 2].focus();
    });
    $('plot').addEventListener('click', function (e) {
      if (!plotGeom) return;
      var rect = this.getBoundingClientRect(), g = plotGeom;
      var px = (e.clientX - rect.left) * (g.W / rect.width), py = (e.clientY - rect.top) * (g.H / rect.height);
      if (px < g.pad.l || px > g.W - g.pad.r || py < g.pad.t || py > g.H - g.pad.b) return;
      var x = g.r.xMin + (px - g.pad.l) / (g.W - g.pad.l - g.pad.r) * (g.r.xMax - g.r.xMin);
      var y = g.r.yMin + (g.H - g.pad.b - py) / (g.H - g.pad.t - g.pad.b) * (g.r.yMax - g.r.yMin);
      var dx = decimalsFor(g.r.xMax - g.r.xMin), dy = decimalsFor(g.r.yMax - g.r.yMin);
      var list = rows();
      var empty = list.filter(function (r) { return r.x.trim() === '' && r.y.trim() === ''; })[0];
      if (!empty && list.length >= MAX_ROWS) { toast('Maksimal ' + MAX_ROWS + ' baris data.'); return; }
      var row = empty || { x: '', y: '' };
      row.x = C.formatNumber(x, dx).replace(/\./g, ''); row.y = C.formatNumber(y, dy).replace(/\./g, '');
      if (!empty) list.push(row);
      dataChanged();
    });
    function heatPoint(e) {
      if (!heatGeom || !heatGeom.X || !model || !model.norm) return null;
      var cv = $('heat'), rect = cv.getBoundingClientRect(), g = heatGeom, v = model.view;
      var px = (e.clientX - rect.left) * (g.W / rect.width), py = (e.clientY - rect.top) * (g.H / rect.height);
      if (px < g.pad.l || py < g.pad.t || px > g.pad.l + g.iw || py > g.pad.t + g.ih) return null;
      return { w: v.wMin + (px - g.pad.l) / g.iw * (v.wMax - v.wMin), b: v.bMax - (py - g.pad.t) / g.ih * (v.bMax - v.bMin) };
    }
    function readout(p) {
      var o = C.toOriginal(model.norm, p.w, p.b), l = C.lossToOriginal(model.norm, C.lossNorm(model.norm, p.w, p.b));
      return 'Garis y = ' + fmt(o.w) + '·x ' + signed(o.b) + ', error ' + fmtErr(l) + errUnit() + '.';
    }
    $('heat').addEventListener('mousemove', function (e) { var p = heatPoint(e); if (p) $('heatReadout').textContent = readout(p) + ' Klik untuk mencoba garis ini.'; });
    $('heat').addEventListener('click', function (e) {
      var p = heatPoint(e); if (!p) return;
      run.tryPoint = p; $('heatReadout').textContent = 'Garis coba-coba: ' + readout(p);
      drawAll();
    });

    document.querySelectorAll('[data-lr]').forEach(function (b) {
      b.addEventListener('click', function () { state.gd.preset = b.getAttribute('data-lr'); syncControls(); saveDraft(); });
    });
    $('lrSlider').addEventListener('input', function () { state.gd.preset = null; state.gd.lr = Math.pow(10, Number(this.value)); syncControls(); saveDraft(); });
    $('stepsSlider').addEventListener('input', function () { state.gd.steps = Number(this.value); syncControls(); saveDraft(); });
    $('speedSlider').addEventListener('input', function () { state.gd.speed = Number(this.value); syncControls(); saveDraft(); });
    $('btnGD').addEventListener('click', function () { trainGD(false); });
    $('btnGDFinish').addEventListener('click', function () { trainGD(true); });
    $('popSlider').addEventListener('input', function () { state.ga.pop = Number(this.value); syncControls(); saveDraft(); });
    $('genSlider').addEventListener('input', function () { state.ga.gens = Number(this.value); syncControls(); saveDraft(); });
    $('mutSlider').addEventListener('input', function () { state.ga.mutation = Number(this.value); syncControls(); saveDraft(); });
    document.querySelectorAll('[data-mut]').forEach(function (b) {
      b.addEventListener('click', function () { state.ga.mutation = Number(b.getAttribute('data-mut')); syncControls(); saveDraft(); });
    });
    $('seedInput').addEventListener('change', function () {
      var v = Math.floor(Number(this.value));
      state.ga.seed = isFinite(v) && v >= 0 ? Math.min(v, 999999) : C.DEFAULT_SEED;
      syncControls(); saveDraft();
    });
    $('btnGA').addEventListener('click', function () { trainGA(false); });
    $('btnGAFinish').addEventListener('click', function () { trainGA(true); });
    $('btnGA5').addEventListener('click', trainGAMany);
    $('predForm').addEventListener('submit', predict);
    $('groupInput').addEventListener('input', function () { state.group = this.value; renderKartu(); saveDraft(); });
    $('conclusionInput').addEventListener('input', function () { state.conclusion = this.value; renderKartu(); saveDraft(); });
    $('btnCopy').addEventListener('click', copySummary);

    $('btnMisi1').addEventListener('click', function () {
      state.scenarioId = C.SCENARIOS[0].id;
      state.data[state.scenarioId] = presetRows(state.scenarioId);
      state.gd = { preset: 'pas', lr: null, steps: 100, speed: state.gd.speed };
      state.ga = { pop: 20, gens: 30, mutation: 0.3, seed: C.DEFAULT_SEED };
      renderScenario(); dataChanged();
      toast('Misi 1 siap: skenario Jarak dan waktu tempuh.');
    });
    $('btnPakaiPreset').addEventListener('click', function () {
      state.gd.preset = 'pas'; state.gd.steps = 100;
      state.ga = { pop: 20, gens: 30, mutation: 0.3, seed: C.DEFAULT_SEED };
      var msg = 'Pengaturan disarankan dipakai: learning rate Pas, 100 langkah, populasi 20, generasi 30, mutasi Sedang.';
      if (parsedPoints().length < 6) {
        if (state.scenarioId === 'custom') {
          var sc = C.SCENARIOS[1];
          state.custom = { name: sc.name, xLabel: sc.xLabel, xUnit: sc.xUnit, yLabel: sc.yLabel, yUnit: sc.yUnit };
          state.data.custom = presetRows(sc.id);
        } else state.data[state.scenarioId] = presetRows(state.scenarioId);
        msg += ' Contoh data juga diisi.';
      }
      renderScenario(); dataChanged(); toast(msg);
    });
    $('btnReset').addEventListener('click', function () {
      var ok = true;
      try { ok = window.confirm('Hapus semua isian dan kembali ke awal?'); } catch (e) { ok = true; }
      if (!ok) return;
      stopAnim(); clearDraft(); state = defaultState();
      rebuildModel(); invalidateRuns(); run.lastPred = null;
      ['gdResult', 'gdWarn', 'gaResult', 'gaManyBox', 'predOut'].forEach(function (id) { $(id).textContent = ''; });
      $('predInput').value = '';
      renderAll(); toast('Semua isian sudah dikembalikan ke awal.');
    });

    var resizeTimer = null;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawAll, 120); });
  }
  function decimalsFor(span) { return span > 50 ? 0 : span > 5 ? 1 : 2; }
  function showTab(name) {
    ['praktik', 'panduan', 'pseudocode', 'tentang'].forEach(function (n) {
      var on = n === name;
      $('tab-' + n).setAttribute('aria-selected', String(on));
      $('tab-' + n).tabIndex = on ? 0 : -1;
      $('panel-' + n).hidden = !on;
    });
    if (name === 'praktik') setTimeout(drawAll, 0);
  }

  // ---------- Mulai ----------
  function init() {
    var restored = loadDraft();
    rebuildModel();
    bind();
    showTab('praktik');
    renderAll();
    if (restored) $('draftNote').textContent = 'Isian sebelumnya dipulihkan dari browser ini.';
    // Service worker dan manifest hanya untuk http(s). Dilewati saat dibuka dari file://.
    if (/^https?:$/.test(location.protocol)) {
      var link = document.createElement('link'); link.rel = 'manifest'; link.href = 'manifest.webmanifest';
      document.head.appendChild(link);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function () { /* mode luring tidak tersedia, alat tetap jalan */ });
      }
    }
    window.__prediktor = { state: function () { return state; }, run: run };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
