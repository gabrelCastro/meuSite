const path = require('path');
const AuthService = require(path.resolve('src', 'services', 'authService'));

class LoginController {
    static async fazerLogin(req, res) {
        try {
            const { usuario, senha } = req.body;
            const token = await AuthService.login(usuario, senha);
            if (!token) return res.redirect('/login');
            const isProduction = process.env.NODE_ENV === 'production';
            const cookieOptions = {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: isProduction,
            };
            res.cookie('authorization', token, cookieOptions);
            return res.redirect('/admin');
        } catch (err) {
            return res.redirect('/login');
        }
    }
}

module.exports = LoginController;
