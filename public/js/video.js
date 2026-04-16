const videos = document.querySelectorAll('.video');

videos.forEach(video => {
  video.addEventListener('click', () => {
    // Obter o ID do post clicado
    const videoId = video.id; 


    // Redirecionar para o link correspondente usando o índice
    window.location.href = `/video/${videoId}`;
  });
});
