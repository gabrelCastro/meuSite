const path = require("path");
const User = require(path.resolve("src","database","Models","user"));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class Auth{

    static async fazerLogin(req,res){

        const { usuario, senha } = await req.body;

        // Verifica se o usuário existe
        const user = await User.findOne({where: {user:usuario}});
        if (!user) {
            return res.redirect('/login'); 
        }
        // Compara a senha
        const isPasswordValid = await bcrypt.compare(senha, user.password);
        if (!isPasswordValid) {
          return res.redirect('/login'); 
        }
      
        // Gera o token JWT

        const token = await jwt.sign({ id: user.user }, process.env.TOKEN, { expiresIn: '365d' });
        await res.cookie('authorization', token, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        return res.redirect('/admin');

        

    }



}

module.exports = Auth
