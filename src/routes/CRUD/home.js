const express = require('express');
const path = require("path");
const routes = express.Router();
const SobreMimService = require(path.resolve('src', 'services', 'sobreMimService'));

routes.get('/', (req, res) => {
    res.redirect('/home');
});

routes.get('/home', async (req, res) => {
    const sobre = await SobreMimService.get();
    res.render('home', { sobre, currentPage: 'home' });
});

module.exports = routes;
