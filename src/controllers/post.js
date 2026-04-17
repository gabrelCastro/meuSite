const path = require('path');
const PostService = require(path.resolve('src', 'services', 'postService'));

function wantsJson(req) {
    return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

class PostController {
    static async postStore(req, res) {
        try {
            if (!req.body.titulo || !req.body.conteudo || !req.file) {
                if (wantsJson(req)) return res.status(400).json({ message: 'Campos obrigatórios não preenchidos' });
                return res.status(400).send('Campos obrigatórios não preenchidos');
            }
            const post = await PostService.create({
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                filename: req.file.filename,
            });
            if (wantsJson(req)) return res.status(201).json({ message: 'Criado com sucesso!', post });
            return res.redirect('/postAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(500).json({ message: err.message });
            return res.status(500).send('Erro: ' + err.message);
        }
    }

    static async getPost(req, res) {
        try {
            const posts = await PostService.getAll();
            res.render('meu_blog', { posts });
        } catch (err) {
            res.status(500).send('Erro ao carregar posts');
        }
    }

    static async getPostPerID(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            if (!post) return res.status(404).send('Post não encontrado');
            res.render('post', { post });
        } catch (err) {
            res.status(500).send('Erro ao carregar post');
        }
    }

    static async getPostPerIDadmin(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            if (!post) return res.status(404).send('Post não encontrado');
            res.render('editarPost', { post });
        } catch (err) {
            res.status(500).send('Erro ao carregar post');
        }
    }

    static async getAdmin(req, res) {
        try {
            const posts = await PostService.getAll();
            res.render('post_admin', { posts });
        } catch (err) {
            res.status(500).send('Erro ao carregar admin');
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
            if (wantsJson(req)) return res.status(200).json({ message: 'Editado com sucesso!', post });
            return res.redirect('/postAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(500).json({ message: err.message });
            return res.status(500).send('Erro: ' + err.message);
        }
    }
}

module.exports = PostController;
