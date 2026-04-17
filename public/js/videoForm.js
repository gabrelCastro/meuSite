tinymce.init({
  selector: '#corpo',
  skin: 'oxide-dark',
  content_css: 'dark',
  height: 400,
  resize: true,
  menubar: 'edit view insert format tools table',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'table', 'wordcount',
    'emoticons', 'codesample', 'quickbars', 'hr'
  ],
  toolbar:
    'undo redo | formatselect | ' +
    'bold italic underline strikethrough | forecolor backcolor | ' +
    'alignleft aligncenter alignright | ' +
    'bullist numlist | outdent indent | ' +
    'link codesample table | ' +
    'blockquote hr | removeformat | fullscreen code',
  quickbars_selection_toolbar: 'bold italic underline | formatselect | bullist numlist | link blockquote',
  quickbars_insert_toolbar: false,
  block_formats: 'Parágrafo=p; Título 1=h1; Título 2=h2; Título 3=h3; Pré-formatado=pre',
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'TypeScript', value: 'typescript' },
    { text: 'CSS', value: 'css' },
    { text: 'Python', value: 'python' },
    { text: 'Bash', value: 'bash' },
    { text: 'SQL', value: 'sql' },
    { text: 'JSON', value: 'json' },
  ],
  content_style: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      line-height: 1.75;
      color: #E2E8F0;
      background: #1A202C;
      padding: 20px 28px;
    }
    h1, h2, h3, h4 { color: #C7D2FE; font-weight: 600; }
    a { color: #818CF8; }
    blockquote {
      border-left: 3px solid #818CF8;
      margin-left: 0;
      padding-left: 16px;
      color: #94A3B8;
    }
    pre { background: #0F1117; border: 1px solid #2D3748; border-radius: 6px; padding: 12px 16px; }
    code { background: #0F1117; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    hr { border-color: #2D3748; }
  `,
  setup: function(editor) {
    const form = document.querySelector('.formulario');
    if (form) {
      form.addEventListener('submit', function() {
        editor.save();
      });
    }
  }
});
