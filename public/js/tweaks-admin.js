(function () {
  var LS_KEY = 'gabrel_site_state_v1';
  var DEFAULTS = { theme: 'dark', accent: 'lime', density: 'airy', heroMode: 'terminal', bg: 'grid' };
  var ACCENTS = {
    lime:    { a: 'oklch(0.82 0.18 130)', ink: 'oklch(0.22 0.06 130)' },
    amber:   { a: 'oklch(0.82 0.17 75)',  ink: 'oklch(0.22 0.06 75)'  },
    cyan:    { a: 'oklch(0.78 0.13 210)', ink: 'oklch(0.22 0.06 210)' },
    magenta: { a: 'oklch(0.72 0.22 340)', ink: 'oklch(0.98 0.02 340)' },
    red:     { a: 'oklch(0.7 0.20 25)',   ink: 'oklch(0.98 0.02 25)'  },
  };
  var ACCENTS_LIGHT = {
    lime:    { a: 'oklch(0.58 0.17 135)', ink: 'oklch(0.98 0.02 135)' },
    amber:   { a: 'oklch(0.62 0.16 70)',  ink: 'oklch(0.98 0.02 70)'  },
    cyan:    { a: 'oklch(0.55 0.14 220)', ink: 'oklch(0.98 0.02 220)' },
    magenta: { a: 'oklch(0.55 0.20 340)', ink: 'oklch(0.98 0.02 340)' },
    red:     { a: 'oklch(0.55 0.18 25)',  ink: 'oklch(0.98 0.02 25)'  },
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }

  function save(t) { localStorage.setItem(LS_KEY, JSON.stringify(t)); }

  function apply(t) {
    var root = document.documentElement;
    root.setAttribute('data-theme', t.theme);
    root.setAttribute('data-accent', t.accent);
    root.setAttribute('data-density', t.density || 'airy');
    var pal = (t.theme === 'light' ? ACCENTS_LIGHT : ACCENTS)[t.accent] || ACCENTS.lime;
    root.style.setProperty('--accent', pal.a);
    root.style.setProperty('--accent-ink', pal.ink);
    if (window.__bgfx) window.__bgfx.setMode(t.bg || 'grid');
  }

  var state = load();
  apply(state);

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.getElementById('tweaks');
    var closeBtn = document.getElementById('tweaks-close');
    if (!panel) return;

    panel.querySelectorAll('[data-key]').forEach(function (group) {
      var key = group.dataset.key;
      group.querySelectorAll('[data-val]').forEach(function (btn) {
        if (btn.dataset.val === state[key]) btn.classList.add('on');
      });
    });

    function updateLabel(key, val) {
      var lbl = document.getElementById('lbl-' + key);
      if (lbl) lbl.textContent = val;
    }
    updateLabel('theme', state.theme);
    updateLabel('density', state.density);
    updateLabel('bg', state.bg);

    panel.querySelectorAll('[data-key]').forEach(function (group) {
      var key = group.dataset.key;
      group.querySelectorAll('[data-val]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          group.querySelectorAll('[data-val]').forEach(function (b) { b.classList.remove('on'); });
          btn.classList.add('on');
          state[key] = btn.dataset.val;
          save(state);
          apply(state);
          updateLabel(key, btn.dataset.val);
        });
      });
    });

    var overlay = document.getElementById('tweaks-overlay');
    function open()  { panel.classList.add('open');    overlay && overlay.classList.add('open'); }
    function close() { panel.classList.remove('open'); overlay && overlay.classList.remove('open'); }
    function toggle(){ panel.classList.contains('open') ? close() : open(); }

    var openBtn = document.getElementById('open-tweaks');
    openBtn  && openBtn.addEventListener('click', toggle);
    closeBtn && closeBtn.addEventListener('click', close);
    overlay  && overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') { e.preventDefault(); toggle(); }
      if (e.key === 'Escape') close();
    });
  });
})();
