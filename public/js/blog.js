const posts = document.querySelectorAll('.post');

posts.forEach(post => {
  post.addEventListener('click', () => {
    // Obter o ID do post clicado
    const postId = post.id; 


    // Redirecionar para o link correspondente usando o índice
    window.location.href = `/post/${postId}`;
  });
});
