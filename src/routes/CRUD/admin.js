const express = require('express');
const path = require("path");
const routes = express.Router();
const auth = require(path.resolve("src","middlewares","auth"))
const SiteConfigController = require(path.resolve("src","controllers","siteConfig"))


routes.get('/admin', auth,(req, res) => {
    res.render('admin');
  });

  // Config de aparência do site (global, controlada pelo admin)
  routes.get('/js/site-tweaks.js', SiteConfigController.clientScript);
  routes.post('/admin/tweaks', auth, SiteConfigController.save);

  routes.get('/criarPost', auth,(req, res) => {
    res.render('criarPost', { error: req.query.error || null });
  });

  routes.get('/criarVideo', auth,(req, res) => {
    res.render('criarVideo', { error: req.query.error || null });
  });


module.exports = routes;