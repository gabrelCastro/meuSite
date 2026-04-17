const path = require('path');
const VideoService = require(path.resolve('src', 'services', 'videoService'));

function wantsJson(req) {
    return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

class VideoController {
    static async videoStore(req, res) {
        try {
            if (!req.file) {
                if (wantsJson(req)) return res.status(400).json({ message: 'Imagem é obrigatória' });
                return res.status(400).send('Imagem é obrigatória');
            }
            const video = await VideoService.create({
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                url: req.body.conteudo,
                corpo: req.body.corpo,
                filename: req.file.filename,
            });
            if (wantsJson(req)) return res.status(201).json({ message: 'Criado com sucesso!', video });
            return res.redirect('/videoAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(400).json({ message: err.message });
            return res.status(400).send('Erro: ' + err.message);
        }
    }

    static async getVideo(req, res) {
        try {
            const videos = await VideoService.getAll();
            res.render('videos', { videos });
        } catch (err) {
            res.status(500).send('Erro ao carregar vídeos');
        }
    }

    static async getVideoPerID(req, res) {
        try {
            const video = await VideoService.getById(Number(req.params.id));
            if (!video) return res.status(404).send('Vídeo não encontrado');
            res.render('video', { video });
        } catch (err) {
            res.status(500).send('Erro ao carregar vídeo');
        }
    }

    static async getVideoPerIDadmin(req, res) {
        try {
            const video = await VideoService.getById(Number(req.params.id));
            if (!video) return res.status(404).send('Vídeo não encontrado');
            res.render('editarVideo', { video });
        } catch (err) {
            res.status(500).send('Erro ao carregar vídeo');
        }
    }

    static async getAdmin(req, res) {
        try {
            const videos = await VideoService.getAll();
            res.render('video_admin', { videos });
        } catch (err) {
            res.status(500).send('Erro ao carregar admin');
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
                descricao: req.body.descricao,
                url: req.body.conteudo,
                corpo: req.body.corpo,
                filename: req.file ? req.file.filename : null,
            });
            if (wantsJson(req)) return res.status(200).json({ message: 'Editado com sucesso!', video });
            return res.redirect('/videoAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(400).json({ message: err.message });
            return res.status(400).send('Erro: ' + err.message);
        }
    }
}

module.exports = VideoController;
