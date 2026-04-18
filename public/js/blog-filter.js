(function () {
  const posts = document.querySelectorAll('#posts .post');
  const chips = document.querySelectorAll('#filters .chip');
  const q = document.getElementById('q');
  if (!chips.length) return;
  let activeTag = 'all';
  function apply() {
    const term = (q ? q.value : '').trim().toLowerCase();
    posts.forEach(function (p) {
      const tags = (p.dataset.tags || '').split(/\s+/);
      const matchTag = activeTag === 'all' || tags.includes(activeTag);
      const matchTerm = !term || p.textContent.toLowerCase().includes(term);
      p.style.display = (matchTag && matchTerm) ? '' : 'none';
    });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      activeTag = c.dataset.tag;
      apply();
    });
  });
  if (q) q.addEventListener('input', apply);
})();
