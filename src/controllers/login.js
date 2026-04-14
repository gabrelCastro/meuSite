const path = require('path');
const AuthService = require(path.resolve('src', 'services', 'authService'));

class LoginController {
    static async fazerLogin(req, res) {
        try {
            const { usuario, senha } = req.body;
            const token = await AuthService.login(usuario, senha);
            if (!token) return res.redirect('/login');
            res.cookie('authorization', token, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.redirect('/admin');
        } catch (err) {
            return res.redirect('/login');
        }
    }
}

module.exports = LoginController;
