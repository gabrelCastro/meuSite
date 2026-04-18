const Sequelize = require('sequelize');
const path = require('path');
const database = require(path.resolve('config', 'db'));

const Projeto = database.define('projeto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    tecnologias: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
    },
    githubUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    demoUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    tipo: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    papel: {
        type: Sequelize.STRING(200),
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
});

module.exports = Projeto;
