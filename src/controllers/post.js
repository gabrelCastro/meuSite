const path = require('path');
const PostService = require(path.resolve('src', 'services', 'postService'));
const { wantsJson } = require(path.resolve('src', 'utils', 'request'));

class PostController {
    static async postStore(req, res) {
        try {
            if (!req.file) {
                if (wantsJson(req)) return res.status(400).json({ message: 'Imagem é obrigatória' });
                return res.redirect('/criarPost?error=Imagem+é+obrigatória');
            }
            const post = await PostService.create({
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tags: req.body.tags,
                pinned: req.body.pinned,
                conteudo: req.body.conteudo,
                filename: req.file ? req.file.filename : null,
            });
            if (wantsJson(req)) return res.status(201).json({ message: 'Criado com sucesso!', post });
            return res.redirect('/postAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(500).json({ message: err.message });
            return res.redirect('/criarPost?error=Erro+ao+salvar+post');
        }
    }

    static async getPost(req, res) {
        try {
            const posts = await PostService.getAll();
            res.render('meu_blog', { posts, currentPage: 'blog' });
        } catch (err) {
            res.status(500).send('Erro ao carregar posts');
        }
    }

    static async getPostPerID(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            if (!post) return res.status(404).send('Post não encontrado');
            res.render('post', { post, currentPage: 'blog' });
        } catch (err) {
            res.status(500).send('Erro ao carregar post');
        }
    }

    static async getPostPerIDadmin(req, res) {
        try {
            const post = await PostService.getById(Number(req.params.id));
            if (!post) return res.status(404).send('Post não encontrado');
            res.render('editarPost', { post, error: req.query.error || null });
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
                descricao: req.body.descricao,
                tags: req.body.tags,
                pinned: req.body.pinned,
                conteudo: req.body.conteudo,
                filename: req.file ? req.file.filename : null,
            });
            if (wantsJson(req)) return res.status(200).json({ message: 'Editado com sucesso!', post });
            return res.redirect('/postAdmin');
        } catch (err) {
            if (wantsJson(req)) return res.status(500).json({ message: err.message });
            return res.redirect('/postEditar/' + req.params.id + '?error=Erro+ao+salvar+post');
        }
    }
}

module.exports = PostController;
