const express = require('express');
const Router = express.Router();
const controllerCliente = require('../controllers/clientes');
Router.get('/getall',controllerCliente.getAll);



module.exports = Router;