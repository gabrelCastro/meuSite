const express = require('express');
const path = require('path');
const routes = express.Router();
const SobreMimController = require(path.resolve('src', 'controllers', 'sobreMim'));
const upload = require(path.resolve('config', 'multer'));
const auth = require(path.resolve('src', 'middlewares', 'auth'));

routes.get('/sobreMimAdmin', auth, SobreMimController.getAdmin);
routes.post('/sobreMim', upload.single('foto'), auth, SobreMimController.upsert);
routes.get('/api/sobreMim', SobreMimController.getAPI);

module.exports = routes;
