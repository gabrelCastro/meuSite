document.querySelectorAll('.btn-deletar').forEach(function(btn) {
    btn.addEventListener('click', async function() {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        if (!confirm('Tem certeza que deseja excluir este post? Essa ação não pode ser desfeita.')) return;

        btn.disabled = true;
        try {
            const resp = await fetch('/post/' + id, {
                method: 'DELETE',
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
            } else {
                const data = await resp.json().catch(function() { return { message: 'Erro desconhecido' }; });
                alert('Erro ao remover post: ' + data.message);
                btn.disabled = false;
            }
        } catch (err) {
            alert('Erro ao remover post: ' + err.message);
            btn.disabled = false;
        }
    });
});
