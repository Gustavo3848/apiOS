const express = require('express');
const Router = express.Router();
const controllerServico = require('../controllers/servico');
Router.post('/insert',controllerServico.insert);
Router.get('/selectAll/:id',controllerServico.selectAll);
Router.get('/deleteById/:id',controllerServico.deleteById);
Router.post('/updateById/:id',controllerServico.updateById);
Router.get('/getById/:id',controllerServico.getById);
module.exports = Router;