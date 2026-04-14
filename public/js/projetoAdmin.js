function deletarProjeto(el, event) {
    event.preventDefault();
    if (!confirm('Deletar este projeto?')) return;
    const id = el.dataset.id;
    fetch('/projeto/' + id, { method: 'DELETE' })
        .then(r => r.ok ? location.reload() : alert('Erro ao deletar.'))
        .catch(() => alert('Erro ao deletar.'));
}
