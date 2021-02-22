const express = require('express');
const Router = express.Router();
const controllerMaterial = require('../controllers/material');
Router.post('/insert',controllerMaterial.insert);
Router.get('/selectAll/:id',controllerMaterial.selectAll);
Router.get('/deleteById/:id',controllerMaterial.deleteById);
Router.post('/updateById/:id',controllerMaterial.updateById);
Router.get('/selectById/:id',controllerMaterial.selectById);
module.exports = Router;