const path = require('path');
const SobreMimService = require(path.resolve('src', 'services', 'sobreMimService'));

class SobreMimController {
    static async getAdmin(req, res) {
        try {
            const sobre = await SobreMimService.get();
            res.render('editarSobreMim', { sobre });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async upsert(req, res) {
        try {
            const files = req.files || {};
            const fotoFile = files.foto ? files.foto[0] : null;
            const curriculoFile = files.curriculo ? files.curriculo[0] : null;
            await SobreMimService.upsert({
                resumo: req.body.resumo,
                cargo: req.body.cargo,
                empresa: req.body.empresa,
                formacao: req.body.formacao,
                universidade: req.body.universidade,
                previsaoFormatura: req.body.previsaoFormatura,
                tecnologias: req.body.tecnologias,
                experiencias: req.body.experiencias,
                filename: fotoFile ? fotoFile.filename : null,
                curriculoFilename: curriculoFile ? curriculoFile.filename : null,
            });
            res.status(200).json({ message: 'Sobre Mim atualizado com sucesso!' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async getAPI(req, res) {
        try {
            const sobre = await SobreMimService.get();
            res.status(200).json(sobre);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = SobreMimController;
