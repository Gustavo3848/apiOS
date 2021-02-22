const mongoose = require('mongoose')
require ('../models/Cliente');
const cliente = mongoose.model('cliente');

class controllerCliente{
    async getAll(req,res) {
        var clientes = await cliente.find().sort({nome:'asc'});
        if(clientes != undefined){
            res.status(200)
            res.json(clientes)
        }else{
            res.status(404)
            res.send("Erro ao selecionar clientes");
        }
    }
    
}
module.exports = new controllerCliente();