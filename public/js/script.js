const paragrafo = document.getElementById('sobreMim');
const textoCompleto = "Desenvolvedor de Software na Equals, integrado ao time de Meios de Pagamentos, onde atuo na migração de serviços legados em arquitetura ESB para microsserviços independentes com Java 11 e Spring Boot. Participo do desenvolvimento de soluções envolvendo gerenciamento de segredos com Vault (OCI), persistência em bancos NoSQL, processamento de arquivos e migração de persistência baseada em arquivos para ORM. Também contribuo com a criação de pipelines CI/CD no Jenkins e configuração de deployments no Kubernetes. Anteriormente, atuei como Engenheiro de Dados na Compass UOL, desenvolvendo pipelines de ETL com AWS Glue, Python, Spark, SQL e Docker, utilizando serviços como EC2, S3 e Lambda. Na iniciação científica (Fapemig/UFLA), desenvolvi uma ferramenta fullstack de avaliação de acessibilidade digital com Laravel (PHP). Iniciei minha trajetória na Comp Júnior como desenvolvedor backend com JavaScript, Express e Sequelize, aplicando metodologias ágeis (Scrum). Graduando em Ciência da Computação pela Universidade Federal de Lavras (UFLA), com previsão de conclusão em 2027.";
let index = 0;

function escreverTexto() {
  if (index < textoCompleto.length) {
    paragrafo.textContent += textoCompleto.charAt(index);
    index++;
    setTimeout(escreverTexto, 5); // Ajuste o tempo entre as letras aqui (em milissegundos)
  }
}
escreverTexto();