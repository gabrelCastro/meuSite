const path = require('path');
const PostService = require(path.resolve('src', 'services', 'postService'));

class PostController {
    static async postStore(req, res) {
        try {
            if (!req.body.titulo || !req.body.conteudo || !req.file) {
                return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
            }
            const post = await PostService.create({
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                filename: req.file.filename,
            });
            res.status(201).json({ message: 'Criado com sucesso!', post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getPost(req, res) {
        try {
            const posts = await PostService.getAll();
            res.render('meu_blog', { posts });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getPostPerID(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            res.render('post', { post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getPostPerIDadmin(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            res.render('editarPost', { post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getAdmin(req, res) {
        try {
            const posts = await PostService.getAll();
            res.render('post_admin', { posts });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async deletePost(req, res) {
        try {
            await PostService.delete(Number(req.params.id));
            res.status(200).json({ message: 'Post deletado com sucesso.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async putPost(req, res) {
        try {
            const post = await PostService.update(req.params.id, {
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                filename: req.file ? req.file.filename : null,
            });
            res.status(200).json({ message: 'Editado com sucesso!', post });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = PostController;
