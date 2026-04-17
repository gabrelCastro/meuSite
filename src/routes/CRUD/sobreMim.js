const express = require('express');
const path = require('path');
const routes = express.Router();
const SobreMimController = require(path.resolve('src', 'controllers', 'sobreMim'));
const upload = require(path.resolve('config', 'multer'));
const auth = require(path.resolve('src', 'middlewares', 'auth'));
const { validateSobreMimUpsert } = require(path.resolve('src', 'middlewares', 'validators'));

routes.get('/sobreMimAdmin', auth, SobreMimController.getAdmin);
routes.post('/sobreMim', auth, upload.single('foto'), validateSobreMimUpsert, SobreMimController.upsert);
routes.get('/api/sobreMim', SobreMimController.getAPI);

module.exports = routes;
