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

function toPlainObject(post) {
    const img = typeof post.img === 'string' ? post.img : (post.img && post.img.url) || '';
    return {
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        img,
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

    static async create({ titulo, conteudo, filename }) {
        const post = await PostRepository.create({
            titulo: titulo.trim(),
            conteudo: sanitizeHtml(conteudo, sanitizeOpts),
            img: { url: '/uploads/' + filename },
        });
        return toPlainObject(post);
    }

    static async update(id, { titulo, conteudo, filename }) {
        const post = await PostRepository.findById(id);
        if (!post) throw new Error('Post não encontrado');

        let img = post.img;
        if (filename) {
            deleteFile(post.img);
            img = { url: '/uploads/' + filename };
        }

        const updated = await PostRepository.update(post, {
            titulo: titulo ? titulo.trim() : post.titulo,
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
