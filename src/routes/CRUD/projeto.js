const express = require('express');
const path = require('path');
const routes = express.Router();
const ProjetoController = require(path.resolve('src', 'controllers', 'projeto'));
const auth = require(path.resolve('src', 'middlewares', 'auth'));

routes.get('/portfolio', ProjetoController.getPortfolio);
routes.get('/portfolioAdmin', auth, ProjetoController.getAdmin);
routes.get('/criarProjeto', auth, (req, res) => res.render('criarProjeto'));
routes.get('/projetoEditar/:id', auth, ProjetoController.getEditar);
routes.post('/projeto', auth, ProjetoController.create);
routes.put('/projetoEditar/:id', auth, ProjetoController.update);
routes.delete('/projeto/:id', auth, ProjetoController.delete);

module.exports = routes;
