const Sequelize = require('sequelize');
const path = require('path');
const database = require(path.resolve("config", "db"));

const SiteConfig = database.define('site_config', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    theme: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'dark'
    },
    accent: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'lime'
    },
    density: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'airy'
    },
    heroMode: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'terminal'
    },
    bg: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'grid'
    }
});

module.exports = SiteConfig;
