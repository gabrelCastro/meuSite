const paragrafo = document.getElementById('sobreMim');
const textoCompleto = "Sou estudante do 4º Período de Ciência da Computação na Universidade Federal de Lavras, onde já fui participante durante 1 ano da Empresa Júnior Comp Jr. Nela, fui responsalvel pelo desenvolvimento back-end, sendo o único nessa área do projeto do site da Juridica Jr. Também realizo Iniciação Científica, pela FAPEMIG, onde estou desenvolvendo uma ferramenta, resposável por gerenciar avalições de acessibilidade em sites da Web. Nesse projeto sou FullStack, e utilizo o framework Laravel, do PHP. Tenho mais conhecimento nas linguagens Python, PHP e JavaScript. No caso do Python, possuo habilidades em análise de dados, tendo um bom domínio da biblioteca Pandas.";
let index = 0;

function escreverTexto() {
  if (index < textoCompleto.length) {
    paragrafo.textContent += textoCompleto.charAt(index);
    index++;
    setTimeout(escreverTexto, 5); // Ajuste o tempo entre as letras aqui (em milissegundos)
  }
}
escreverTexto();

// ── Scroll Reveal ──────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ── 3D Tilt on Cards ──────────────────────────────
const tiltCards = document.querySelectorAll('.conheca-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 8 degrees tilt
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.setProperty('--rx', rotateX + 'deg');
    card.style.setProperty('--ry', rotateY + 'deg');
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});