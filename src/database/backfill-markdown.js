// One-time migration: convert existing post bodies from HTML (TinyMCE) to Markdown.
// Run manually AFTER backing up the database:  node src/database/backfill-markdown.js
require('dotenv').config();
const path = require('path');
const TurndownService = require('turndown');

const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
});

// Preserve fenced code language — TinyMCE/Prism put `language-xxx` on the <pre> or the <code>.
td.addRule('fencedCodeWithLang', {
    filter: (node) => node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE',
    replacement: (content, node) => {
        const code = node.firstChild;
        const cls = (code.getAttribute('class') || '') + ' ' + (node.getAttribute('class') || '');
        const m = cls.match(/language-([\w-]+)/);
        const lang = m && m[1] !== 'markup' ? m[1] : (m ? 'html' : '');
        const text = code.textContent.replace(/\n$/, '');
        return '\n\n```' + lang + '\n' + text + '\n```\n\n';
    },
});

const looksLikeHtml = (s) => /<\/?(p|div|h[1-6]|ul|ol|li|pre|code|blockquote|img|br|strong|em|a|table|figure|span)\b[^>]*>/i.test(s || '');

async function run() {
    const db = require(path.resolve('config', 'db'));
    const Post = require(path.resolve('src', 'database', 'Models', 'Post'));
    const Video = require(path.resolve('src', 'database', 'Models', 'video'));

    await db.authenticate();

    // [Model, campo de corpo rico] — o conteúdo HTML (TinyMCE) vira Markdown.
    const targets = [[Post, 'conteudo'], [Video, 'corpo']];

    for (const [Model, field] of targets) {
        const records = await Model.findAll();
        let converted = 0;
        for (const rec of records) {
            if (!looksLikeHtml(rec[field])) continue;
            const markdown = td.turndown(rec[field]).trim();
            await rec.update({ [field]: markdown });
            converted++;
            console.log(`✓ ${Model.name} #${rec.id} "${rec.titulo}" convertido`);
        }
        console.log(`${Model.name}: ${converted}/${records.length} convertido(s) para Markdown.`);
    }

    console.log('\nMigração concluída.');
    await db.close();
}

run().catch((e) => {
    console.error('Erro na migração:', e);
    process.exit(1);
});
