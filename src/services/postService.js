const path = require('path');
const fs = require('fs');
const PostRepository = require(path.resolve('src', 'repositories', 'postRepository'));

function generateSlug(titulo) {
    return titulo
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function generateUniqueSlug(titulo, excludeId = null) {
    const base = generateSlug(titulo);
    let slug = base;
    let counter = 2;
    while (true) {
        const existing = await PostRepository.findBySlug(slug);
        if (!existing || (excludeId && existing.id === excludeId)) break;
        slug = `${base}-${counter++}`;
    }
    return slug;
}

function parseTags(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

function toPlainObject(post) {
    const img = typeof post.img === 'string' ? post.img : (post.img && post.img.url) || '';
    return {
        id: post.id,
        slug: post.slug || null,
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

    static async getBySlug(slug) {
        const post = await PostRepository.findBySlug(slug);
        return post ? toPlainObject(post) : null;
    }

    static async create({ titulo, descricao, tags, pinned, conteudo, filename }) {
        const tituloTrimmed = titulo.trim();
        const slug = await generateUniqueSlug(tituloTrimmed);

        const post = await PostRepository.create({
            titulo: tituloTrimmed,
            slug,
            descricao: descricao ? descricao.trim() : null,
            tags: parseTags(tags),
            pinned: pinned === true || pinned === 'on' || pinned === '1',
            conteudo: conteudo ? conteudo.trim() : '',
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

        const novoTitulo = titulo ? titulo.trim() : post.titulo;
        const slug = novoTitulo !== post.titulo
            ? await generateUniqueSlug(novoTitulo, post.id)
            : post.slug;

        const updated = await PostRepository.update(post, {
            titulo: novoTitulo,
            slug,
            descricao: descricao !== undefined ? (descricao ? descricao.trim() : null) : post.descricao,
            tags: tags !== undefined ? parseTags(tags) : post.tags,
            pinned: pinned !== undefined ? (pinned === true || pinned === 'on' || pinned === '1') : post.pinned,
            conteudo: conteudo ? conteudo.trim() : post.conteudo,
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
