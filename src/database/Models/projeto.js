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
});

module.exports = Projeto;
