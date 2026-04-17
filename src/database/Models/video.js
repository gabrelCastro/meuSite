const Sequelize = require('sequelize');
const path = require('path');
const database = require(path.resolve("config","db"));

const Video = database.define('video', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING(500),
        allowNull: true
    },
    conteudo:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    corpo: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    img:{
        type: Sequelize.JSON,
        allowNull: false
    }
    });

module.exports = Video;