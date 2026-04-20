const path = require('path');
const VideoService = require(path.resolve('src', 'services', 'videoService'));
const { wantsJson } = require(path.resolve('src', 'utils', 'request'));

class VideoController {
    static async videoStore(req, res) {
        try {
            if (!req.file) {
                if (wantsJson(req)) return res.status(400).json({ message: 'Imagem é obrigatória' });
                return res.redirect('/criarVideo?error=Imagem+é+obrigatória');
            }
            const video = await VideoService.create({
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tags: req.body.tags,
                serie: req.body.serie,
                url: req.body.conteudo,
                corpo: req.body.corpo,
                filename: req.file.filename,
            });
            if (wantsJson(req)) return res.status(201).json({ message: 'Criado com sucesso!', video });
            return res.redirect('/videoAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(400).json({ message: err.message });
            return res.redirect('/criarVideo?error=Erro+ao+salvar+vídeo');
        }
    }

    static async getVideo(req, res) {
        try {
            const videos = await VideoService.getAll();
            res.render('videos', { videos, currentPage: 'videos' });
        } catch (err) {
            res.status(500).send('Erro ao carregar vídeos');
        }
    }

    static async getVideoPerID(req, res) {
        try {
            const param = req.params.slug;

            if (/^\d+$/.test(param)) {
                const video = await VideoService.getById(Number(param));
                if (!video) return res.status(404).send('Vídeo não encontrado');
                if (video.slug) return res.redirect(301, '/video/' + video.slug);
                return res.render('video', { video, currentPage: 'videos' });
            }

            const video = await VideoService.getBySlug(param);
            if (!video) return res.status(404).send('Vídeo não encontrado');
            res.render('video', { video, currentPage: 'videos' });
        } catch (err) {
            res.status(500).send('Erro ao carregar vídeo');
        }
    }

    static async getVideoPerIDadmin(req, res) {
        try {
            const video = await VideoService.getById(Number(req.params.id));
            if (!video) return res.status(404).send('Vídeo não encontrado');
            res.render('editarVideo', { video, error: req.query.error || null });
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
                tags: req.body.tags,
                serie: req.body.serie,
                url: req.body.conteudo,
                corpo: req.body.corpo,
                filename: req.file ? req.file.filename : null,
            });
            if (wantsJson(req)) return res.status(200).json({ message: 'Editado com sucesso!', video });
            return res.redirect('/videoAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(400).json({ message: err.message });
            return res.redirect('/videoEditar/' + req.params.id + '?error=Erro+ao+salvar+vídeo');
        }
    }
}

module.exports = VideoController;
