const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const tokenReady = req.cookies.authorization;

    if (!tokenReady) {
        return res.redirect('/login');
    }

    try {
        jwt.verify(tokenReady, process.env.TOKEN);
        next();
    } catch (err) {
        return res.redirect('/login');
    }
}