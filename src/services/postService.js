const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const PostRepository = require(path.resolve('src', 'repositories', 'postRepository'));

const sanitizeOpts = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'span']),
    allowedAttributes: { '*': ['style', 'class'], 'a': ['href', 'target'], 'img': ['src', 'alt'] },
};

function toPlainObject(post) {
    return {
        id: post.id,
        titulo: post.titulo,
        conteudo: post.conteudo,
        img: post.img.url,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
    };
}

function deleteFile(url) {
    const filePath = path.resolve('public', url.replace(/^\//, ''));
    fs.unlink(filePath, () => {});
}

class PostService {
    static async getAll() {
        const posts = await PostRepository.findAll();
        return posts.map(toPlainObject);
    }

    static getById(id) {
        return PostRepository.findById(id);
    }

    static create({ titulo, conteudo, filename }) {
        return PostRepository.create({
            titulo: titulo.trim(),
            conteudo: sanitizeHtml(conteudo, sanitizeOpts),
            img: { url: '/uploads/' + filename },
        });
    }

    static async update(id, { titulo, conteudo, filename }) {
        const post = await PostRepository.findById(id);
        if (!post) throw new Error('Post não encontrado');

        let img = post.img;
        if (filename) {
            deleteFile(post.img.url);
            img = { url: '/uploads/' + filename };
        }

        return PostRepository.update(post, {
            titulo: titulo ? titulo.trim() : post.titulo,
            conteudo: conteudo ? sanitizeHtml(conteudo, sanitizeOpts) : post.conteudo,
            img,
        });
    }

    static async delete(id) {
        const post = await PostRepository.findById(id);
        if (!post) throw new Error('Post não encontrado');
        deleteFile(post.img.url);
        return PostRepository.delete(post);
    }
}

module.exports = PostService;
