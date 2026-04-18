(function () {
  var LS_KEY = 'gabrel_site_state_v1';
  var DEFAULTS = { theme: 'dark', accent: 'lime', density: 'airy', heroMode: 'terminal', bg: 'grid' };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }

  function save(t) {
    localStorage.setItem(LS_KEY, JSON.stringify(t));
  }

  function apply(t) {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-accent', t.accent);
    document.documentElement.setAttribute('data-density', t.density || 'airy');
  }

  var state = load();
  apply(state);

  document.addEventListener('DOMContentLoaded', function () {
    var panel = document.getElementById('tweaks');
    var closeBtn = document.getElementById('tweaks-close');
    if (!panel) return;

    // mark active buttons
    panel.querySelectorAll('[data-key]').forEach(function (group) {
      var key = group.dataset.key;
      group.querySelectorAll('[data-val]').forEach(function (btn) {
        if (btn.dataset.val === state[key]) btn.classList.add('on');
      });
    });

    // labels
    function updateLabel(key, val) {
      var lbl = document.getElementById('lbl-' + key);
      if (lbl) lbl.textContent = val;
    }
    updateLabel('theme', state.theme);
    updateLabel('density', state.density);
    updateLabel('bg', state.bg);

    // button clicks
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
