const path = require('path');
const fs = require('fs');
const VideoRepository = require(path.resolve('src', 'repositories', 'videoRepository'));

function urlToEmbed(raw) {
    const url = (raw || '').trim();

    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (yt) {
        return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${yt[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    }

    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo) {
        return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${vimeo[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    }

    return null;
}

function toPlainObject(video) {
    const img = typeof video.img === 'string' ? video.img : (video.img && video.img.url) || '';
    return {
        id: video.id,
        titulo: video.titulo,
        descricao: video.descricao || null,
        conteudo: video.conteudo,
        corpo: video.corpo || null,
        img,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
    };
}

function deleteFile(img) {
    const url = typeof img === 'string' ? img : (img && img.url);
    if (!url) return;
    const filePath = path.resolve('public', url.replace(/^\//, ''));
    fs.unlink(filePath, () => {});
}

class VideoService {
    static async getAll() {
        const videos = await VideoRepository.findAll();
        return videos.map(toPlainObject);
    }

    static async getById(id) {
        const video = await VideoRepository.findById(id);
        return video ? toPlainObject(video) : null;
    }

    static async create({ titulo, descricao, url, corpo, filename }) {
        const embed = urlToEmbed(url);
        if (!embed) throw new Error('URL inválida. Use um link do YouTube ou Vimeo.');

        const video = await VideoRepository.create({
            titulo: titulo.trim(),
            descricao: descricao ? descricao.trim() : null,
            conteudo: embed,
            corpo: corpo || null,
            img: { url: '/uploads/' + filename },
        });
        return toPlainObject(video);
    }

    static async update(id, { titulo, descricao, url, corpo, filename }) {
        const video = await VideoRepository.findById(id);
        if (!video) throw new Error('Vídeo não encontrado');

        let img = video.img;
        if (filename) {
            deleteFile(video.img);
            img = { url: '/uploads/' + filename };
        }

        let conteudo = video.conteudo;
        if (url && url.trim()) {
            const embed = urlToEmbed(url);
            if (!embed) throw new Error('URL inválida. Use um link do YouTube ou Vimeo.');
            conteudo = embed;
        }

        const updated = await VideoRepository.update(video, {
            titulo: titulo ? titulo.trim() : video.titulo,
            descricao: descricao !== undefined ? (descricao ? descricao.trim() : null) : video.descricao,
            conteudo,
            corpo: corpo !== undefined ? (corpo || null) : video.corpo,
            img,
        });
        return toPlainObject(updated);
    }

    static async delete(id) {
        const video = await VideoRepository.findById(id);
        if (!video) throw new Error('Vídeo não encontrado');
        deleteFile(video.img);
        return VideoRepository.delete(video);
    }
}

module.exports = VideoService;
