document.getElementById('updateVideoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const btn = this.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Salvando…';

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'PUT',
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin',
        body: formData,
    })
    .then(function(response) {
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }
        if (!response.ok) {
            return response.json().then(function(d) { throw new Error(d.message || 'Erro ao atualizar vídeo.'); });
        }
        window.location.href = '/videoAdmin';
    })
    .catch(function(error) {
        alert(error.message);
        btn.disabled = false;
        btn.textContent = 'Salvar alterações';
    });
});
