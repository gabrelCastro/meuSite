const Sequelize = require('sequelize');
const path = require('path');
const database = require(path.resolve("config","db"));

const Post = database.define('post', {
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
    tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    pinned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    conteudo:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    img:{
        type: Sequelize.JSON,
        allowNull: true
    }
    });

module.exports = Post;