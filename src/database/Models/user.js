const Sequelize = require('sequelize');
const database = require('../../../config/db');
const bcrypt = require('bcryptjs');
const User = database.define('users', {

    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    user:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    }

}, {
    hooks: {
            afterSync: async () => {
            try {
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
                await User.create({
                user: process.env.ADMIN_USER,
                password: hashedPassword
                });}
                catch (error) {
                console.error('Erro ao criar usuário:', error);
                }
            }
          }
    })


module.exports = User;
