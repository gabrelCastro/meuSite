const path = require('path');
const VideoService = require(path.resolve('src', 'services', 'videoService'));

class VideoController {
    static async videoStore(req, res) {
        try {
            if (!req.body.titulo || !req.body.conteudo || !req.file) {
                return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
            }
            const video = await VideoService.create({
                titulo: req.body.titulo,
                url: req.body.conteudo,
                filename: req.file.filename,
            });
            res.status(201).json({ message: 'Criado com sucesso!', video });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    static async getVideo(req, res) {
        try {
            const videos = await VideoService.getAll();
            res.render('explicando', { videos });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getVideoPerID(req, res) {
        try {
            const post = await VideoService.getById(Number(req.params.id));
            res.render('video', { post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getVideoPerIDadmin(req, res) {
        try {
            const post = await VideoService.getById(Number(req.params.id));
            res.render('editarVideo', { post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getAdmin(req, res) {
        try {
            const videos = await VideoService.getAll();
            res.render('video_admin', { videos });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async deleteVideo(req, res) {
        try {
            await VideoService.delete(Number(req.params.id));
            res.status(200).json({ message: 'Vídeo deletado com sucesso.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async putVideo(req, res) {
        try {
            const video = await VideoService.update(req.params.id, {
                titulo: req.body.titulo,
                url: req.body.conteudo,
                filename: req.file ? req.file.filename : null,
            });
            res.status(200).json({ message: 'Editado com sucesso!', video });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = VideoController;
