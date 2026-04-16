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
    return {
        id: video.id,
        titulo: video.titulo,
        conteudo: video.conteudo,
        img: video.img.url,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
    };
}

function deleteFile(url) {
    const filePath = path.resolve('public', url.replace(/^\//, ''));
    fs.unlink(filePath, () => {});
}

class VideoService {
    static async getAll() {
        const videos = await VideoRepository.findAll();
        return videos.map(toPlainObject);
    }

    static getById(id) {
        return VideoRepository.findById(id);
    }

    static create({ titulo, url, filename }) {
        const embed = urlToEmbed(url);
        if (!embed) throw new Error('URL inválida. Use um link do YouTube ou Vimeo.');

        return VideoRepository.create({
            titulo: titulo.trim(),
            conteudo: embed,
            img: { url: '/uploads/' + filename },
        });
    }

    static async update(id, { titulo, url, filename }) {
        const video = await VideoRepository.findById(id);
        if (!video) throw new Error('Vídeo não encontrado');

        let img = video.img;
        if (filename) {
            deleteFile(video.img.url);
            img = { url: '/uploads/' + filename };
        }

        let conteudo = video.conteudo;
        if (url && url.trim()) {
            const embed = urlToEmbed(url);
            if (!embed) throw new Error('URL inválida. Use um link do YouTube ou Vimeo.');
            conteudo = embed;
        }

        return VideoRepository.update(video, {
            titulo: titulo ? titulo.trim() : video.titulo,
            conteudo,
            img,
        });
    }

    static async delete(id) {
        const video = await VideoRepository.findById(id);
        if (!video) throw new Error('Vídeo não encontrado');
        deleteFile(video.img.url);
        return VideoRepository.delete(video);
    }
}

module.exports = VideoService;
