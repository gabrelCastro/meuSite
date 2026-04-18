const path = require('path');
const ProjetoRepository = require(path.resolve('src', 'repositories', 'projetoRepository'));

function parseTecnologias(raw) {
    if (!raw) return [];
    return raw.split(',').map(t => t.trim()).filter(Boolean);
}

function parseUrl(raw) {
    if (!raw || !raw.trim()) return null;
    return raw.trim();
}

class ProjetoService {
    static getAll() {
        return ProjetoRepository.findAll();
    }

    static getById(id) {
        return ProjetoRepository.findById(id);
    }

    static create({ titulo, descricao, tecnologias, githubUrl, demoUrl, tipo, papel, status }) {
        return ProjetoRepository.create({
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            tecnologias: parseTecnologias(tecnologias),
            githubUrl: parseUrl(githubUrl),
            demoUrl: parseUrl(demoUrl),
            tipo: tipo || null,
            papel: papel ? papel.trim() : null,
            status: status || null,
        });
    }

    static async update(id, { titulo, descricao, tecnologias, githubUrl, demoUrl, tipo, papel, status }) {
        const projeto = await ProjetoRepository.findById(id);
        if (!projeto) throw new Error('Projeto não encontrado');

        return ProjetoRepository.update(projeto, {
            titulo: titulo ? titulo.trim() : projeto.titulo,
            descricao: descricao ? descricao.trim() : projeto.descricao,
            tecnologias: tecnologias !== undefined ? parseTecnologias(tecnologias) : projeto.tecnologias,
            githubUrl: parseUrl(githubUrl),
            demoUrl: parseUrl(demoUrl),
            tipo: tipo !== undefined ? (tipo || null) : projeto.tipo,
            papel: papel !== undefined ? (papel ? papel.trim() : null) : projeto.papel,
            status: status !== undefined ? (status || null) : projeto.status,
        });
    }

    static async delete(id) {
        const projeto = await ProjetoRepository.findById(id);
        if (!projeto) throw new Error('Projeto não encontrado');
        return ProjetoRepository.delete(projeto);
    }
}

module.exports = ProjetoService;
