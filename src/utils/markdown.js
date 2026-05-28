const sanitizeHtml = require('sanitize-html');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

const sanitizeOpts = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img', 'h1', 'h2', 'span', 'figure', 'figcaption',
    ]),
    allowedAttributes: {
        '*': ['class'],
        a: ['href', 'target', 'rel', 'title'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
        code: ['class'],
        pre: ['class'],
        span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    transformTags: {
        a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }, true),
    },
};

const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: false,
    highlight(str, lang) {
        const cls = lang ? ` language-${lang}` : '';
        if (lang && hljs.getLanguage(lang)) {
            try {
                const code = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
                return `<pre class="hljs"><code class="hljs${cls}">${code}</code></pre>`;
            } catch (_) { /* fall through */ }
        }
        return `<pre class="hljs"><code class="hljs${cls}">${md.utils.escapeHtml(str)}</code></pre>`;
    },
});

function renderMarkdown(source) {
    if (!source) return '';
    return sanitizeHtml(md.render(source), sanitizeOpts);
}

module.exports = { renderMarkdown, sanitizeOpts };
