const jwt = require('jsonwebtoken');

function isAjax(req) {
    return req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));
}

module.exports = async (req, res, next) => {
    const tokenReady = req.cookies.authorization;

    if (!tokenReady) {
        if (isAjax(req)) return res.status(401).json({ message: 'Não autenticado' });
        return res.redirect('/login');
    }

    try {
        jwt.verify(tokenReady, process.env.TOKEN, { algorithms: ['HS256'] });
        next();
    } catch (err) {
        if (isAjax(req)) return res.status(401).json({ message: 'Token inválido' });
        return res.redirect('/login');
    }
}