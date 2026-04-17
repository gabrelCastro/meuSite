const express = require('express');
const path = require('path');
const routes = express.Router();
const ProjetoController = require(path.resolve('src', 'controllers', 'projeto'));
const auth = require(path.resolve('src', 'middlewares', 'auth'));
const { validateProjetoCreate, validateProjetoUpdate, validateId } = require(path.resolve('src', 'middlewares', 'validators'));

routes.get('/portfolio', ProjetoController.getPortfolio);
routes.get('/portfolioAdmin', auth, ProjetoController.getAdmin);
routes.get('/criarProjeto', auth, (req, res) => res.render('criarProjeto'));
routes.get('/projetoEditar/:id', auth, validateId, ProjetoController.getEditar);
routes.post('/projeto', auth, validateProjetoCreate, ProjetoController.create);
routes.put('/projetoEditar/:id', auth, validateProjetoUpdate, ProjetoController.update);
routes.delete('/projeto/:id', auth, validateId, ProjetoController.delete);

module.exports = routes;
