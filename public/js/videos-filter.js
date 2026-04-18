(function () {
  const cards = document.querySelectorAll('#vgrid .vcard');
  const chips = document.querySelectorAll('.filters .chip');
  if (!chips.length) return;
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      const tag = c.dataset.tag;
      cards.forEach(function (card) {
        const tags = (card.dataset.tags || '').split(/\s+/);
        card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
      });
    });
  });
})();
