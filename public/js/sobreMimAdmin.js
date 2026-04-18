// Preview foto
document.getElementById('fotoInput').addEventListener('change', function(e) {
    const preview = document.getElementById('fotoPreview');
    if (e.target.files[0]) {
        preview.src = URL.createObjectURL(e.target.files[0]);
        preview.style.display = 'block';
    }
});

// Adicionar tecnologia
document.getElementById('addTechBtn').addEventListener('click', addTech);
document.getElementById('newTech').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); addTech(); }
});

function addTech() {
    const input = document.getElementById('newTech');
    const val = input.value.trim();
    if (!val) return;
    const tag = document.createElement('span');
    tag.className = 'tag';
    const textNode = document.createTextNode(val);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '\u00D7';
    btn.addEventListener('click', function() { tag.remove(); });
    tag.appendChild(textNode);
    tag.appendChild(btn);
    document.getElementById('techContainer').appendChild(tag);
    input.value = '';
    input.focus();
}

// Remover tags existentes
document.querySelectorAll('#techContainer .tag button').forEach(function(btn) {
    btn.addEventListener('click', function() { btn.parentElement.remove(); });
});

// Adicionar experiência
document.getElementById('addExpBtn').addEventListener('click', function() {
    const card = document.createElement('div');
    card.className = 'exp-card';

    card.innerHTML =
        '<div class="exp-card-header"><button type="button" class="btn-remove-exp">Remover</button></div>' +
        '<div class="exp-grid">' +
            '<div class="campo"><label>Empresa</label><input type="text" class="input exp-empresa" required></div>' +
            '<div class="campo"><label>Cargo</label><input type="text" class="input exp-cargo" required></div>' +
        '</div>' +
        '<div class="campo" style="margin-top:12px"><label>Período</label><input type="text" class="input exp-periodo" placeholder="Ex: Jan 2024 - Atual"></div>' +
        '<div class="campo" style="margin-top:12px"><label>Descrição</label><textarea class="textarea exp-descricao" rows="2"></textarea></div>';

    card.querySelector('.btn-remove-exp').addEventListener('click', function() { card.remove(); });
    document.getElementById('expContainer').appendChild(card);
});

// Remover experiências existentes
document.querySelectorAll('.btn-remove-exp').forEach(function(btn) {
    btn.addEventListener('click', function() { btn.closest('.exp-card').remove(); });
});

// Submit
document.getElementById('sobreMimForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    var techs = [];
    document.querySelectorAll('#techContainer .tag').forEach(function(tag) {
        var text = tag.childNodes[0].textContent.trim();
        if (text) techs.push(text);
    });

    var exps = [];
    document.querySelectorAll('.exp-card').forEach(function(card) {
        exps.push({
            empresa: card.querySelector('.exp-empresa').value.trim(),
            cargo: card.querySelector('.exp-cargo').value.trim(),
            periodo: card.querySelector('.exp-periodo').value.trim(),
            descricao: card.querySelector('.exp-descricao').value.trim(),
        });
    });

    var formData = new FormData();
    formData.append('resumo', document.getElementById('resumo').value);
    formData.append('cargo', document.getElementById('cargo').value);
    formData.append('empresa', document.getElementById('empresa').value);
    formData.append('formacao', document.getElementById('formacao').value);
    formData.append('universidade', document.getElementById('universidade').value);
    formData.append('previsaoFormatura', document.getElementById('previsaoFormatura').value);
    formData.append('tecnologias', techs.join(','));
    formData.append('experiencias', JSON.stringify(exps));

    var fotoInput = document.getElementById('fotoInput');
    if (fotoInput.files[0]) {
        formData.append('foto', fotoInput.files[0]);
    }

    var curriculoInput = document.getElementById('curriculoInput');
    if (curriculoInput && curriculoInput.files[0]) {
        formData.append('curriculo', curriculoInput.files[0]);
    }

    try {
        var resp = await fetch('/sobreMim', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' }
        });

        var data = await resp.json();

        if (resp.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login';
            return;
        }
        if (resp.ok) {
            alert('Salvo com sucesso!');
            location.reload();
        } else {
            alert('Erro: ' + data.message);
        }
    } catch (err) {
        alert('Erro ao salvar: ' + err.message);
    }
});
