const path = require('path');
const ProjetoService = require(path.resolve('src', 'services', 'projetoService'));

class ProjetoController {
    static async getPortfolio(req, res) {
        try {
            const projetos = await ProjetoService.getAll();
            res.render('portfolio', { projetos, currentPage: 'portfolio' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getAdmin(req, res) {
        try {
            const projetos = await ProjetoService.getAll();
            res.render('projeto_admin', { projetos });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getEditar(req, res) {
        try {
            const projeto = await ProjetoService.getById(Number(req.params.id));
            res.render('editarProjeto', { projeto });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async create(req, res) {
        try {
            const projeto = await ProjetoService.create({
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tecnologias: req.body.tecnologias,
                githubUrl: req.body.githubUrl,
                demoUrl: req.body.demoUrl,
                tipo: req.body.tipo,
                papel: req.body.papel,
                status: req.body.status,
            });
            res.status(201).json({ message: 'Projeto criado com sucesso!', projeto });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async update(req, res) {
        try {
            const projeto = await ProjetoService.update(Number(req.params.id), {
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                tecnologias: req.body.tecnologias,
                githubUrl: req.body.githubUrl,
                demoUrl: req.body.demoUrl,
                tipo: req.body.tipo,
                papel: req.body.papel,
                status: req.body.status,
            });
            res.status(200).json({ message: 'Projeto atualizado com sucesso!', projeto });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async delete(req, res) {
        try {
            await ProjetoService.delete(Number(req.params.id));
            res.status(200).json({ message: 'Projeto deletado com sucesso.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ProjetoController;
