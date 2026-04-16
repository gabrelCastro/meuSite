document.getElementById('updateVideoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    tinymce.triggerSave();

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/postAdmin';
        } else {
            throw new Error('Erro ao atualizar post.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao atualizar post. Tente novamente.');
    });
});
