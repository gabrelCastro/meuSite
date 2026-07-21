// Torna o card inteiro do post clicável, sem quebrar os links/botões internos
// nem atrapalhar a seleção de texto.
(function () {
  var cards = document.querySelectorAll('article[data-href]');

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Clique num link/botão real: deixa o comportamento nativo agir.
      if (e.target.closest('a, button, input, label')) return;
      // Usuário está selecionando texto: não navega.
      var sel = window.getSelection && window.getSelection().toString();
      if (sel) return;
      // Ctrl/Cmd/meio: respeita o "abrir em nova aba" do usuário.
      if (e.metaKey || e.ctrlKey || e.button === 1) {
        window.open(card.dataset.href, '_blank');
        return;
      }
      window.location.href = card.dataset.href;
    });
  });
})();
