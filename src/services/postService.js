const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const PostRepository = require(path.resolve('src', 'repositories', 'postRepository'));

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

function parseTags(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

function toPlainObject(post) {
    const img = typeof post.img === 'string' ? post.img : (post.img && post.img.url) || '';
    return {
        id: post.id,
        titulo: post.titulo,
        descricao: post.descricao || null,
        tags: post.tags || [],
        pinned: post.pinned || false,
        conteudo: post.conteudo,
        img: img || null,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
}

function deleteFile(img) {
    const url = typeof img === 'string' ? img : (img && img.url);
    if (!url) return;
    const filePath = path.resolve('public', url.replace(/^\//, ''));
    fs.unlink(filePath, () => {});
}

class PostService {
    static async getAll() {
        const posts = await PostRepository.findAll();
        return posts.map(toPlainObject);
    }

    static async getById(id) {
        const post = await PostRepository.findById(id);
        return post ? toPlainObject(post) : null;
    }

    static async create({ titulo, descricao, tags, pinned, conteudo, filename }) {
        const post = await PostRepository.create({
            titulo: titulo.trim(),
            descricao: descricao ? descricao.trim() : null,
            tags: parseTags(tags),
            pinned: pinned === true || pinned === 'on' || pinned === '1',
            conteudo: sanitizeHtml(conteudo, sanitizeOpts),
            img: filename ? { url: '/uploads/' + filename } : null,
        });
        return toPlainObject(post);
    }

    static async update(id, { titulo, descricao, tags, pinned, conteudo, filename }) {
        const post = await PostRepository.findById(id);
        if (!post) throw new Error('Post não encontrado');

        let img = post.img;
        if (filename) {
            deleteFile(post.img);
            img = { url: '/uploads/' + filename };
        }

        const updated = await PostRepository.update(post, {
            titulo: titulo ? titulo.trim() : post.titulo,
            descricao: descricao !== undefined ? (descricao ? descricao.trim() : null) : post.descricao,
            tags: tags !== undefined ? parseTags(tags) : post.tags,
            pinned: pinned !== undefined ? (pinned === true || pinned === 'on' || pinned === '1') : post.pinned,
            conteudo: conteudo ? sanitizeHtml(conteudo, sanitizeOpts) : post.conteudo,
            img,
        });
        return toPlainObject(updated);
    }

    static async delete(id) {
        const post = await PostRepository.findById(id);
        if (!post) throw new Error('Post não encontrado');
        deleteFile(post.img);
        return PostRepository.delete(post);
    }
}

module.exports = PostService;
