const path = require('path');
const Projeto = require(path.resolve('src', 'database', 'Models', 'projeto'));

class ProjetoRepository {
    static findAll() {
        return Projeto.findAll({ order: [['createdAt', 'DESC']] });
    }

    static findById(id) {
        return Projeto.findByPk(id);
    }

    static create(data) {
        return Projeto.create(data);
    }

    static update(projeto, data) {
        return projeto.update(data);
    }

    static delete(projeto) {
        return projeto.destroy();
    }
}

module.exports = ProjetoRepository;
