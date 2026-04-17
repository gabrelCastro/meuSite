document.getElementById('updateVideoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (window.tinymce) tinymce.triggerSave();

    const form = this;
    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) submitBtn.disabled = true;

    try {
        const resp = await fetch(form.action, {
            method: 'PUT',
            body: new FormData(form),
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
        });

        if (resp.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login';
            return;
        }
        if (resp.ok) {
            window.location.href = '/postAdmin';
            return;
        }
        const data = await resp.json().catch(function() { return { message: 'Erro desconhecido' }; });
        alert('Erro ao atualizar post: ' + data.message);
    } catch (err) {
        alert('Erro ao atualizar post: ' + err.message);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});
