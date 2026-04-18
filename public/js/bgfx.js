window.__bgfx = (function () {
  var canvas = document.getElementById('bgfx');
  if (!canvas) return { setMode: function () {} };
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var mode = 'grid';
  var raf = 0;
  var cachedBg = null;
  var t0 = performance.now();
  var mouse = { x: 0.5, y: 0.3, tx: 0.5, ty: 0.3 };
  var st = null;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    init();
  }

  function rgbOf(varName, fallback) {
    var tmp = document.createElement('span');
    tmp.style.color = getComputedStyle(document.documentElement).getPropertyValue(varName);
    document.body.appendChild(tmp);
    var rgb = getComputedStyle(tmp).color;
    tmp.remove();
    var m = rgb.match(/\d+(?:\.\d+)?/g);
    return m ? [m[0] | 0, m[1] | 0, m[2] | 0] : fallback;
  }
  function accentRGB() { return rgbOf('--accent', [180, 220, 80]); }
  function fgRGB() { return rgbOf('--fg-3', [110, 110, 118]); }

  function init() {
    if (mode === 'constellation') {
      var count = Math.min(90, Math.max(40, Math.round(W * H / 22000)));
      st = {
        pts: Array.from({ length: count }, function () {
          return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * 0.25, vy: (Math.random() - .5) * 0.25, r: Math.random() * 1.4 + 0.4 };
        })
      };
    } else if (mode === 'matrix') {
      var fs = 14;
      var cols = Math.ceil(W / fs);
      st = {
        fs: fs, drops: Array.from({ length: cols }, function () {
          return { y: Math.random() * H, speed: 30 + Math.random() * 80, len: 8 + Math.floor(Math.random() * 18), ch: function () { return String.fromCharCode(0x30A0 + Math.random() * 96); } };
        })
      };
    } else if (mode === 'ascii') {
      var fs2 = 13;
      st = { fs: fs2, cols: Math.ceil(W / fs2) + 1, rows: Math.ceil(H / fs2) + 1, chars: ['·', '·', '·', ':', '-', '=', '+', '*', '<', '>', '/', '\\', '|'] };
    } else if (mode === 'grid') {
      st = { step: 32 };
    }
  }

  function drawGrid() {
    var c = fgRGB();
    var step = st.step;
    var ox = (mouse.x - 0.5) * 14;
    var oy = (mouse.y - 0.5) * 14;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    for (var y = -step; y < H + step; y += step) {
      for (var x = -step; x < W + step; x += step) {
        var dx = x - W * mouse.x, dy = y - H * mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var pulse = Math.max(0, 1 - d / (Math.min(W, H) * 0.45));
        ctx.globalAlpha = 0.18 + pulse * 0.55;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, 0.8 + pulse * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawMatrix(dt) {
    var ar = accentRGB(), fr = fgRGB();
    cachedBg = cachedBg || getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000';
    ctx.fillStyle = cachedBg;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.font = st.fs + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    for (var i = 0; i < st.drops.length; i++) {
      var drop = st.drops[i];
      drop.y += drop.speed * dt;
      if (drop.y - drop.len * st.fs > H) { drop.y = -Math.random() * H * 0.5; drop.speed = 30 + Math.random() * 80; drop.len = 8 + Math.floor(Math.random() * 18); }
      var x = i * st.fs;
      for (var k = 0; k < drop.len; k++) {
        var yy = drop.y - k * st.fs;
        if (yy < -st.fs || yy > H) continue;
        var a = Math.max(0, 1 - k / drop.len);
        ctx.fillStyle = k === 0
          ? 'rgba(' + ar[0] + ',' + ar[1] + ',' + ar[2] + ',' + (0.9 * a) + ')'
          : 'rgba(' + fr[0] + ',' + fr[1] + ',' + fr[2] + ',' + (0.35 * a) + ')';
        ctx.fillText(drop.ch(), x, yy);
      }
    }
  }

  function drawConstellation() {
    var c = fgRGB(), ar = accentRGB();
    ctx.clearRect(0, 0, W, H);
    var pts = st.pts;
    for (var i = 0; i < pts.length; i++) {
      pts[i].x += pts[i].vx; pts[i].y += pts[i].vy;
      if (pts[i].x < 0 || pts[i].x > W) pts[i].vx *= -1;
      if (pts[i].y < 0 || pts[i].y > H) pts[i].vy *= -1;
    }
    var max = 130;
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < max) {
          var al = (1 - d / max) * 0.32;
          ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var dd = Math.sqrt(Math.pow(p.x - W * mouse.x, 2) + Math.pow(p.y - H * mouse.y, 2));
      var near = Math.max(0, 1 - dd / 200);
      ctx.fillStyle = near > 0
        ? 'rgba(' + ar[0] + ',' + ar[1] + ',' + ar[2] + ',' + (0.8 * near + 0.3) + ')'
        : 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near * 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawAscii(t) {
    var ar = accentRGB(), fr = fgRGB();
    ctx.clearRect(0, 0, W, H);
    ctx.font = st.fs + 'px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    var chars = st.chars;
    var T = t * 0.0006;
    for (var j = 0; j < st.rows; j++) {
      for (var i = 0; i < st.cols; i++) {
        var cx = i - st.cols / 2, cy = j - st.rows / 2;
        var d = Math.sqrt(cx * cx + cy * cy);
        var v = Math.sin(d * 0.22 - T * 2.0) * 0.5 + 0.5;
        var idx = Math.min(chars.length - 1, Math.floor(v * chars.length));
        var alpha = 0.08 + v * 0.35;
        ctx.fillStyle = v > 0.82
          ? 'rgba(' + ar[0] + ',' + ar[1] + ',' + ar[2] + ',' + (alpha * 0.9) + ')'
          : 'rgba(' + fr[0] + ',' + fr[1] + ',' + fr[2] + ',' + (alpha * 0.55) + ')';
        ctx.fillText(chars[idx], i * st.fs, j * st.fs);
      }
    }
  }

  var prev = performance.now();
  var FRAME_MS = 1000 / 30;

  function loop(now) {
    raf = requestAnimationFrame(loop);
    var elapsed = now - prev;
    if (elapsed < FRAME_MS) return;
    prev = now - (elapsed % FRAME_MS);
    var dt = Math.min(0.05, elapsed / 1000);
    var t = now - t0;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    if (mode === 'off') return;
    if (mode === 'grid') drawGrid();
    else if (mode === 'matrix') drawMatrix(dt);
    else if (mode === 'constellation') drawConstellation();
    else if (mode === 'ascii') drawAscii(t);
  }

  function setMode(m) {
    cachedBg = null;
    mode = m;
    canvas.style.display = (m === 'off') ? 'none' : '';
    if (m !== 'off') init();
    else ctx.clearRect(0, 0, W, H);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', function (e) {
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = e.clientY / window.innerHeight;
  }, { passive: true });

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  if (!prefersReduced) raf = requestAnimationFrame(loop);

  return { setMode: setMode };
})();
