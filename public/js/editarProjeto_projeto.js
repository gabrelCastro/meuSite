document.getElementById('projetoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = this.dataset.id;
    const data = Object.fromEntries(new FormData(this));
    fetch('/projetoEditar/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => r.ok ? (window.location.href = '/portfolioAdmin') : r.json().then(d => alert(d.message)))
    .catch(() => alert('Erro ao salvar projeto.'));
});
