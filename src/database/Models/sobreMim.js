const Sequelize = require('sequelize');
const path = require('path');
const database = require(path.resolve("config", "db"));

const SobreMim = database.define('sobre_mim', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    resumo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cargo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    formacao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    universidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    previsaoFormatura: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tecnologias: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
    },
    experiencias: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
    },
    foto: {
        type: Sequelize.JSON,
        allowNull: true
    },
    curriculo: {
        type: Sequelize.JSON,
        allowNull: true
    }
});

module.exports = SobreMim;
