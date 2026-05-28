(function () {
    const editor = document.querySelector('.md-editor');
    const ta = editor ? editor.querySelector('.md-source') : null;
    const form = ta ? ta.closest('form') : null;
    const toolbar = document.querySelector('.md-toolbar');
    const previewArticle = document.querySelector('.md-preview .post-body');
    const errorBox = document.getElementById('formError');
    if (!form || !ta || !editor) return;

    // hidden file input for inline images
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // ── Markdown insertion helpers ──────────────────────────
    function surround(before, after, placeholder) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = ta.value.slice(start, end) || placeholder;
        ta.setRangeText(before + sel + after, start, end, 'end');
        ta.focus();
        schedulePreview();
    }

    function linePrefix(prefix) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const block = val.slice(lineStart, end) || '';
        const replaced = block.split('\n').map(l => prefix + l).join('\n');
        ta.setRangeText(replaced, lineStart, end, 'end');
        ta.focus();
        schedulePreview();
    }

    function codeBlock() {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const sel = ta.value.slice(start, end) || 'codigo';
        ta.setRangeText('```\n' + sel + '\n```\n', start, end, 'end');
        ta.focus();
        schedulePreview();
    }

    const actions = {
        bold: () => surround('**', '**', 'texto em negrito'),
        italic: () => surround('*', '*', 'texto em itálico'),
        h2: () => linePrefix('## '),
        code: () => surround('`', '`', 'código'),
        codeblock: codeBlock,
        link: () => surround('[', '](url)', 'texto do link'),
        ul: () => linePrefix('- '),
        ol: () => linePrefix('1. '),
        quote: () => linePrefix('> '),
        image: () => fileInput.click(),
    };

    if (toolbar) {
        toolbar.addEventListener('click', function (e) {
            const btn = e.target.closest('button[data-md]');
            if (!btn) return;
            const fn = actions[btn.dataset.md];
            if (fn) fn();
        });
    }

    // ── Live preview (debounced, server-rendered) ───────────
    let previewTimer;
    function schedulePreview() {
        clearTimeout(previewTimer);
        previewTimer = setTimeout(renderPreview, 250);
    }

    async function renderPreview() {
        if (!previewArticle) return;
        try {
            const resp = await fetch('/post/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ conteudo: ta.value }),
            });
            if (!resp.ok) return;
            const data = await resp.json();
            previewArticle.innerHTML = data.html || '';
        } catch (_) { /* keep last preview */ }
    }

    ta.addEventListener('input', schedulePreview);

    // ── Inline image upload ─────────────────────────────────
    async function uploadImage(file) {
        const fd = new FormData();
        fd.append('imagem', file);
        const resp = await fetch('/admin/upload', {
            method: 'POST',
            body: fd,
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' },
        });
        if (resp.status === 401) { window.location.href = '/login'; return null; }
        if (!resp.ok) {
            const d = await resp.json().catch(() => ({}));
            throw new Error(d.message || 'falha no upload');
        }
        return (await resp.json()).url;
    }

    async function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const token = '![enviando ' + file.name + '...]()';
        ta.setRangeText(token, ta.selectionStart, ta.selectionEnd, 'end');
        schedulePreview();
        const replaceToken = (text) => {
            const idx = ta.value.indexOf(token);
            if (idx !== -1) ta.setRangeText(text, idx, idx + token.length, 'end');
        };
        try {
            const url = await uploadImage(file);
            if (!url) { replaceToken(''); return; }
            const alt = file.name.replace(/\.[^.]+$/, '');
            replaceToken('![' + alt + '](' + url + ')');
        } catch (e) {
            replaceToken('![falha: ' + e.message + ']()');
        }
        schedulePreview();
    }

    fileInput.addEventListener('change', function () {
        if (fileInput.files[0]) handleImageFile(fileInput.files[0]);
        fileInput.value = '';
    });

    ta.addEventListener('dragover', function (e) { e.preventDefault(); ta.classList.add('md-drag'); });
    ta.addEventListener('dragleave', function () { ta.classList.remove('md-drag'); });
    ta.addEventListener('drop', function (e) {
        const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
        if (files.length) { e.preventDefault(); ta.classList.remove('md-drag'); files.forEach(handleImageFile); }
    });
    ta.addEventListener('paste', function (e) {
        const items = Array.from((e.clipboardData && e.clipboardData.items) || []);
        const img = items.find(i => i.type.startsWith('image/'));
        if (img) { const f = img.getAsFile(); if (f) { e.preventDefault(); handleImageFile(f); } }
    });

    // ── View toggle (split / write / preview) ───────────────
    const viewBtns = document.querySelectorAll('.md-view-toggle button[data-view]');
    viewBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            editor.dataset.view = btn.dataset.view;
            viewBtns.forEach(b => b.classList.toggle('active', b === btn));
            if (btn.dataset.view !== 'write') renderPreview();
        });
    });

    // ── Keyboard shortcuts ──────────────────────────────────
    document.addEventListener('keydown', function (e) {
        const mod = e.ctrlKey || e.metaKey;
        if (!mod) return;
        const k = e.key.toLowerCase();
        if (k === 's') { e.preventDefault(); form.requestSubmit(); return; }
        if (document.activeElement !== ta) return;
        if (k === 'b') { e.preventDefault(); actions.bold(); }
        else if (k === 'i') { e.preventDefault(); actions.italic(); }
        else if (k === 'k') { e.preventDefault(); actions.link(); }
    });

    // ── Submit via fetch (create POST / edit PUT) ───────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const method = form.dataset.method || 'POST';
        const btn = form.querySelector('.btn-submit');
        if (btn) btn.disabled = true;
        if (errorBox) errorBox.hidden = true;
        try {
            const resp = await fetch(form.action, {
                method: method,
                body: new FormData(form),
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' },
            });
            if (resp.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
                window.location.href = '/login';
                return;
            }
            if (resp.ok) { window.location.href = '/postAdmin'; return; }
            const data = await resp.json().catch(() => ({ message: 'Erro desconhecido' }));
            const msg = (data.errors && data.errors.join(', ')) || data.message || 'Erro ao salvar post';
            if (errorBox) { errorBox.textContent = msg; errorBox.hidden = false; }
            else { alert(msg); }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const msg = 'Erro ao salvar post: ' + err.message;
            if (errorBox) { errorBox.textContent = msg; errorBox.hidden = false; } else { alert(msg); }
        } finally {
            if (btn) btn.disabled = false;
        }
    });

    // initial preview
    if (ta.value.trim()) renderPreview();
})();
