document.querySelectorAll('.btn-deletar').forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        const videoId = this.getAttribute('data-id');
        if (!confirm('Remover este vídeo?')) return;

        fetch('/video/' + videoId, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        })
        .then(function(response) {
            if (response.status === 401) { window.location.href = '/login'; return; }
            if (!response.ok) throw new Error('Erro ao remover vídeo.');
            window.location.reload();
        })
        .catch(function(error) {
            alert(error.message);
        });
    });
});
