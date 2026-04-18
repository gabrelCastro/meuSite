document.documentElement.classList.add('js-on');

(function(){
  // ---------- State ----------
  const LS = 'gabrel_site_state_v1';
  const defaults = Object.assign({
    theme: 'dark', accent: 'lime', density: 'cozy', heroMode: 'terminal', bg: 'grid'
  }, window.__TWEAKS__ || {});
  let state;
  try { state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS) || '{}')); }
  catch { state = Object.assign({}, defaults); }

  const ACCENTS = {
    lime:    { a: 'oklch(0.82 0.18 130)', ink: 'oklch(0.22 0.06 130)' },
    amber:   { a: 'oklch(0.82 0.17 75)',  ink: 'oklch(0.22 0.06 75)'  },
    cyan:    { a: 'oklch(0.78 0.13 210)', ink: 'oklch(0.22 0.06 210)' },
    magenta: { a: 'oklch(0.72 0.22 340)', ink: 'oklch(0.98 0.02 340)' },
    red:     { a: 'oklch(0.7 0.20 25)',   ink: 'oklch(0.98 0.02 25)'  },
  };
  const ACCENTS_LIGHT = {
    lime:    { a: 'oklch(0.58 0.17 135)', ink: 'oklch(0.98 0.02 135)' },
    amber:   { a: 'oklch(0.62 0.16 70)',  ink: 'oklch(0.98 0.02 70)'  },
    cyan:    { a: 'oklch(0.55 0.14 220)', ink: 'oklch(0.98 0.02 220)' },
    magenta: { a: 'oklch(0.55 0.20 340)', ink: 'oklch(0.98 0.02 340)' },
    red:     { a: 'oklch(0.55 0.18 25)',  ink: 'oklch(0.98 0.02 25)'  },
  };
  const DENSITY = {
    compact: { container: '860px', gap: '18px', bodyFS: '13px' },
    cozy:    { container: '980px', gap: '24px', bodyFS: '14px' },
    airy:    { container: '1080px', gap: '32px', bodyFS: '15px' },
  };

  // ---------- Background FX ----------
  const bgfx = (function(){
    const canvas = document.getElementById('bgfx');
    const ctx = canvas.getContext('2d');
    let W=0, H=0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mode = 'grid';
    let raf = 0;
    let t0 = performance.now();
    let mouse = { x: 0.5, y: 0.3, tx: 0.5, ty: 0.3 };
    let st = null;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }
    function rgbOf(varName, fallback) {
      const tmp = document.createElement('span');
      tmp.style.color = getComputedStyle(document.documentElement).getPropertyValue(varName);
      document.body.appendChild(tmp);
      const rgb = getComputedStyle(tmp).color; tmp.remove();
      const m = rgb.match(/\d+(?:\.\d+)?/g);
      return m ? [m[0]|0, m[1]|0, m[2]|0] : fallback;
    }
    function accentRGB() { return rgbOf('--accent', [180,220,80]); }
    function fgRGB() { return rgbOf('--fg-3', [150,150,160]); }

    function init() {
      if (mode === 'constellation') {
        const count = Math.min(90, Math.max(40, Math.round(W*H / 22000)));
        st = { pts: Array.from({length: count}, () => ({
          x: Math.random()*W, y: Math.random()*H,
          vx: (Math.random()-.5)*0.25, vy: (Math.random()-.5)*0.25,
          r: Math.random()*1.4 + 0.4
        })) };
      } else if (mode === 'matrix') {
        const fs = 14;
        const cols = Math.ceil(W / fs);
        st = { fs, drops: Array.from({length: cols}, () => ({
          y: Math.random()*H,
          speed: 30 + Math.random()*80,
          len: 8 + Math.floor(Math.random()*18),
          ch: () => String.fromCharCode(0x30A0 + Math.random()*96)
        })) };
      } else if (mode === 'ascii') {
        const fs = 13;
        st = { fs, cols: Math.ceil(W/fs)+1, rows: Math.ceil(H/fs)+1,
          chars: ['·','·','·',':','-','=','+','*','<','>','/','\\','|'] };
      } else if (mode === 'grid') {
        st = { step: 32 };
      }
    }

    function drawGrid() {
      const [r,g,b] = fgRGB();
      const step = st.step;
      const ox = (mouse.x - 0.5) * 14;
      const oy = (mouse.y - 0.5) * 14;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      for (let y = -step; y < H + step; y += step) {
        for (let x = -step; x < W + step; x += step) {
          const dx = x - W*mouse.x, dy = y - H*mouse.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          const pulse = Math.max(0, 1 - d / (Math.min(W,H)*0.45));
          ctx.globalAlpha = 0.18 + pulse * 0.55;
          ctx.beginPath();
          ctx.arc(x + ox, y + oy, 0.8 + pulse*2.2, 0, Math.PI*2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawMatrix(dt) {
      const [ar,ag,ab] = accentRGB();
      const [fr,fg,fb] = fgRGB();
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000';
      ctx.globalAlpha = 0.12;
      ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 1;
      ctx.font = `${st.fs}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      for (let i = 0; i < st.drops.length; i++) {
        const d = st.drops[i];
        d.y += d.speed * dt;
        if (d.y - d.len*st.fs > H) {
          d.y = -Math.random()*H*0.5;
          d.speed = 30 + Math.random()*80;
          d.len = 8 + Math.floor(Math.random()*18);
        }
        const x = i * st.fs;
        for (let k = 0; k < d.len; k++) {
          const yy = d.y - k*st.fs;
          if (yy < -st.fs || yy > H) continue;
          const a = Math.max(0, 1 - k/d.len);
          ctx.fillStyle = k===0
            ? `rgba(${ar},${ag},${ab},${0.9*a})`
            : `rgba(${fr},${fg},${fb},${0.35*a})`;
          ctx.fillText(d.ch(), x, yy);
        }
      }
    }

    function drawConstellation() {
      const [r,g,b] = fgRGB();
      const [ar,ag,ab] = accentRGB();
      ctx.clearRect(0,0,W,H);
      const pts = st.pts;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      const max = 130;
      for (let i=0;i<pts.length;i++) {
        for (let j=i+1;j<pts.length;j++) {
          const a = pts[i], c = pts[j];
          const dx = a.x-c.x, dy = a.y-c.y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < max) {
            const al = (1 - d/max) * 0.32;
            ctx.strokeStyle = `rgba(${r},${g},${b},${al})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(c.x,c.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const dd = Math.sqrt((p.x-W*mouse.x)**2 + (p.y-H*mouse.y)**2);
        const near = Math.max(0, 1 - dd / 200);
        ctx.fillStyle = near > 0
          ? `rgba(${ar},${ag},${ab},${0.8*near+0.3})`
          : `rgba(${r},${g},${b},0.55)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near*1.5, 0, Math.PI*2); ctx.fill();
      }
    }

    function drawAscii(t) {
      const [ar,ag,ab] = accentRGB();
      const [fr,fg,fb] = fgRGB();
      ctx.clearRect(0,0,W,H);
      ctx.font = `${st.fs}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'top';
      const chars = st.chars;
      const T = t * 0.0006;
      for (let j=0;j<st.rows;j++) {
        for (let i=0;i<st.cols;i++) {
          const cx = i - st.cols/2;
          const cy = j - st.rows/2;
          const d = Math.sqrt(cx*cx + cy*cy);
          const v = Math.sin(d*0.22 - T*2.0) * 0.5 + 0.5;
          const idx = Math.min(chars.length-1, Math.floor(v * chars.length));
          const alpha = 0.08 + v * 0.35;
          ctx.fillStyle = v > 0.82
            ? `rgba(${ar},${ag},${ab},${alpha*0.9})`
            : `rgba(${fr},${fg},${fb},${alpha*0.55})`;
          ctx.fillText(chars[idx], i*st.fs, j*st.fs);
        }
      }
    }

    let prev = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - prev)/1000);
      prev = now;
      const t = now - t0;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      if (mode === 'off') { raf = requestAnimationFrame(loop); return; }
      if (mode === 'grid') drawGrid();
      else if (mode === 'matrix') drawMatrix(dt);
      else if (mode === 'constellation') drawConstellation();
      else if (mode === 'ascii') drawAscii(t);
      raf = requestAnimationFrame(loop);
    }

    function setMode(m) {
      mode = m;
      canvas.style.display = (m === 'off') ? 'none' : '';
      if (m !== 'off') init();
      else ctx.clearRect(0,0,W,H);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    }, { passive: true });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    if (!prefersReduced) raf = requestAnimationFrame(loop);
    return { setMode };
  })();

  function apply() {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    const pal = state.theme === 'light' ? ACCENTS_LIGHT[state.accent] : ACCENTS[state.accent];
    root.style.setProperty('--accent', pal.a);
    root.style.setProperty('--accent-ink', pal.ink);
    const d = DENSITY[state.density] || DENSITY.cozy;
    root.style.setProperty('--container', d.container);
    root.style.setProperty('--gap', d.gap);
    document.body.style.fontSize = d.bodyFS;

    // theme icon
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.innerHTML = state.theme === 'light'
        ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
        : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
    }

    // hero mode
    const term = document.getElementById('terminal');
    if (term) term.style.display = state.heroMode === 'static' ? 'none' : '';

    // background mode
    bgfx.setMode(state.bg || 'grid');
    const lb = document.getElementById('lbl-bg'); if (lb) lb.textContent = state.bg || 'grid';

    // tweaks UI state
    document.querySelectorAll('.seg').forEach(seg => {
      const key = seg.dataset.key;
      seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.val === state[key]));
    });
    document.querySelectorAll('.swatches button').forEach(b => {
      b.classList.toggle('on', b.dataset.val === state.accent);
    });
    const lt = document.getElementById('lbl-theme'); if (lt) lt.textContent = state.theme;
    const ld = document.getElementById('lbl-density'); if (ld) ld.textContent = state.density;
  }

  function persist() {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch {}
    // Notify host (edit mode)
    try { window.parent && window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*'); } catch {}
  }
  function setKey(k, v) { state[k] = v; apply(); persist(); }

  // ---------- Theme toggle ----------
  const tt = document.getElementById('theme-toggle');
  if (tt) tt.addEventListener('click', () => {
    setKey('theme', state.theme === 'dark' ? 'light' : 'dark');
  });

  // ---------- Tweaks panel ----------
  const tweaksEl = document.getElementById('tweaks');
  const tweaksClose = document.getElementById('tweaks-close');
  if (tweaksClose && tweaksEl) tweaksClose.addEventListener('click', () => tweaksEl.classList.remove('open'));
  document.querySelectorAll('.seg').forEach(seg => {
    seg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      setKey(seg.dataset.key, b.dataset.val);
    });
  });
  document.querySelectorAll('.swatches').forEach(sw => {
    sw.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      setKey('accent', b.dataset.val);
    });
  });

  // ---------- Edit mode host protocol ----------
  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (!tweaksEl) return;
    if (d.type === '__activate_edit_mode') tweaksEl.classList.add('open');
    else if (d.type === '__deactivate_edit_mode') tweaksEl.classList.remove('open');
  });
  try { window.parent && window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

  // ---------- Keyboard ----------
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 't' || e.key === 'T') {
      setKey('theme', state.theme === 'dark' ? 'light' : 'dark');
    } else if (e.key === '/') {
      if (!tweaksEl) return;
      e.preventDefault();
      tweaksEl.classList.toggle('open');
    } else if (e.key === 'Escape') {
      if (tweaksEl) tweaksEl.classList.remove('open');
    }
  });

  // ---------- Chip scroll ----------
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.goto;
      const target = document.getElementById(id);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ---------- CV stub ----------
  const cvBtn = document.getElementById('cv-download');
  if (cvBtn) cvBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const blob = new Blob(
      ['Gabriel Ferreira de Castro — CV placeholder.\nAdicione seu CV como cv.pdf na pasta.'],
      { type: 'text/plain' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'gabriel-cv.txt'; a.click();
  });

  // ---------- Char reveal on visible ----------
  function revealEl(el) {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let n, nodes = [];
    while ((n = walker.nextNode())) nodes.push(n);
    let k = 0;
    nodes.forEach(textNode => {
      const frag = document.createDocumentFragment();
      const text = textNode.nodeValue;
      for (let i = 0; i < text.length; i++) {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = text[i];
        s.style.animationDelay = (k++ * 6 + (parseInt(el.dataset.wait||0))) + 'ms';
        frag.appendChild(s);
      }
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) revealEl(e.target); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Apply initial ----------
  apply();
})();