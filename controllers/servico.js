const mongoose = require('mongoose');
require('../models/Servico');
const servicos = mongoose.model('servicos');

class controllerServicos{
    async insert(req,res){
        var servico = await req.body;
        if(servico != undefined | servico != null | servico != "" | servico != " "){
            await servicos.create(servico);
            res.status(200);
            res.send("Serviço adicionado com sucesso!");
        }else{
            res.status(404);
            res.send("Erro ao adicionar serviço!");
        }
    }
    async selectAll(req,res){
        var serv = await servicos.find({os:req.params.id})
        if(serv != undefined | serv != null){
            res.status(200);
            res.json(serv)
        }else{
            res.status(404);
        }
    }
    async deleteById(req,res){
        var id = await req.params.id
        if(id != undefined | id != null | id != "" | id != " "){
            await servicos.findByIdAndDelete(id);
            res.status(200);
            res.send("Serviço removido com sucesso!");
        }else{
            res.status(404);
            res.send("Erro ao remover serviço!");
        }
    }
    async updateById(req,res){
        var id = await req.params.id
        var serv = await req.body;
        if(serv != undefined | serv != null | serv != "" | serv != " "){
            await servicos.findByIdAndUpdate(id,serv);
            res.status(200);
            res.send("Serviço atualizado com sucesso!")
        }else{
            res.status(404);
            res.send("Erro ao atualizar serviço!");
        }
    }
    async getById(req,res){
        var id = await req.params.id;
        var serv = await servicos.findById(id);
        if(serv != undefined | serv != null | serv != "" | serv != " "){
            res.status(200)
            res.json(serv);
        }else{
            res.status(404);
            res.send("Erro ao selecionar serviço!");
        }      
    }
}
module.exports = new controllerServicos();