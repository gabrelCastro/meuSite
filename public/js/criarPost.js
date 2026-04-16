tinymce.init({
  selector: '#conteudo',
  skin: 'oxide-dark',
  content_css: 'dark',
  height: 540,
  resize: true,
  menubar: 'file edit view insert format tools table',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'wordcount',
    'emoticons', 'codesample', 'quickbars', 'hr'
  ],
  toolbar:
    'undo redo | formatselect fontselect fontsizeselect | ' +
    'bold italic underline strikethrough | forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist | outdent indent | ' +
    'link image media codesample table | ' +
    'blockquote hr | removeformat | fullscreen code',
  quickbars_selection_toolbar: 'bold italic underline | formatselect | bullist numlist | link blockquote',
  quickbars_insert_toolbar: false,
  block_formats: 'Parágrafo=p; Título 1=h1; Título 2=h2; Título 3=h3; Título 4=h4; Pré-formatado=pre',
  font_formats:
    'Inter=Inter,sans-serif;' +
    'Arial=arial,helvetica,sans-serif;' +
    'Georgia=georgia,serif;' +
    'Courier New=courier new,courier,monospace;' +
    'Trebuchet MS=trebuchet ms,geneva,sans-serif',
  fontsize_formats: '10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
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
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #2D3748; padding: 8px 12px; }
    th { background: #2D3748; color: #C7D2FE; }
    hr { border-color: #2D3748; }
    img { max-width: 100%; border-radius: 6px; }
  `,
  image_advtab: true,
  image_title: true,
  automatic_uploads: false,
  file_picker_types: 'image',
  file_picker_callback: function(cb) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function() {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = function() { cb(reader.result, { title: file.name }); };
      reader.readAsDataURL(file);
    };
    input.click();
  },
  setup: function(editor) {
    const form = document.querySelector('.formulario');
    if (form) {
      form.addEventListener('submit', function() {
        editor.save();
      });
    }
  }
});
