const mongoose = require('mongoose');
require('../models/Material');
const materiais = mongoose.model('materiais');
class controllerMateriais{
    async insert(req,res) {
        var material = await req.body;
        if(material != undefined | material != null | material != "" | material != " "){
            await materiais.create(material);
            res.status(200);
            res.send("Material criado com sucesso!");
        }else{
            res.send("Erro ao criar material!");
            res.status(404);
        }
    }
    async selectAll(req,res){
        var id = await req.params.id;
        var material = await materiais.find({os:id});
        if(material != undefined | material != null | material != "" | material != " "){
            res.json(material);
            res.status(200);
        }else{ 
            res.status(404);
            res.send("Erro ao selecionar materiais!");
        }
    }
    async selectById(req,res){
        var id = await req.params.id
        var material = await materiais.findById(id);
        if(material != undefined | material != null | material != "" | material != " "){
            res.json(material);
            res.status(200);
        }else{ 
            res.status(404);
            res.send("Erro ao selecionar material!");
        }
    }
    async updateById(req,res){
        var id = await req.params.id
        var material = await req.body;
        if(material != undefined | material != null | material != "" | material != " "){
            await materiais.findByIdAndUpdate(id,material);
            res.send("Material atualizado com sucesso!");
            res.status(200);
        }else{ 
            res.status(404);
            res.send("Erro ao selecionar material!");
        }
    }
    async deleteById(req,res){
        var id = await req.params.id
        if(id != undefined | id != null | id != "" | id != " "){
            await materiais.findByIdAndDelete(id);
            res.send("Material removido com sucesso!");
            res.status(200);
        }else{ 
            res.status(404);
            res.send("Erro ao remover material!");
        }
    }
}
module.exports = new controllerMateriais();