const express = require('express');
const path = require("path");
const loginController = require(path.resolve("src","controllers","login"));
const rateLimit = require('express-rate-limit');
const routes = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
});

routes.get('/login', (req, res) => {
    res.render('login');
});

routes.post('/login', loginLimiter, loginController.fazerLogin);

routes.post('/logout', (req, res) => {
    res.clearCookie('authorization');
    return res.redirect('/login');
});

module.exports = routes;