// ── Typewriter ────────────────────────────────────
const paragrafo = document.getElementById('sobreMim');

// Texto vem do data-attribute do script tag ou fallback hardcoded
const scriptTag = document.querySelector('script[data-resumo]');
const textoCompleto = (scriptTag && scriptTag.getAttribute('data-resumo')) ||
    "Desenvolvedor de Software na Equals, integrado ao time de Meios de Pagamentos, onde atuo na migração de serviços legados em arquitetura ESB para microsserviços independentes com Java 11 e Spring Boot. Participo do desenvolvimento de soluções envolvendo gerenciamento de segredos com Vault (OCI), persistência em bancos NoSQL, processamento de arquivos e migração de persistência baseada em arquivos para ORM. Também contribuo com a criação de pipelines CI/CD no Jenkins e configuração de deployments no Kubernetes. Anteriormente, atuei como Engenheiro de Dados na Compass UOL, desenvolvendo pipelines de ETL com AWS Glue, Python, Spark, SQL e Docker, utilizando serviços como EC2, S3 e Lambda. Na iniciação científica (Fapemig/UFLA), desenvolvi uma ferramenta fullstack de avaliação de acessibilidade digital com Laravel (PHP). Iniciei minha trajetória na Comp Júnior como desenvolvedor backend com JavaScript, Express e Sequelize, aplicando metodologias ágeis (Scrum). Graduando em Ciência da Computação pela Universidade Federal de Lavras (UFLA), com previsão de conclusão em 2027.";

let index = 0;

if (paragrafo) {
    function escreverTexto() {
        if (index < textoCompleto.length) {
            paragrafo.textContent += textoCompleto.charAt(index);
            index++;
            setTimeout(escreverTexto, 8);
        }
    }
    escreverTexto();
}

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

// ── Tech pills stagger animation ──────────────────
const techPills = document.querySelectorAll('.about__tech-pill');
techPills.forEach((pill, i) => {
    pill.style.animationDelay = (i * 0.05) + 's';
});
