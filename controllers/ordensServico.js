const e = require('express');
const mongoose = require('mongoose');
require('../models/OS');
const os = mongoose.model('os');
require('../models/Id');
const numeroOs = mongoose.model('id')


class controllerOrdensServico {
    async findAll(req, res) {
        var ordensServico = await os.find().populate('cliente');
        if (ordensServico == undefined) {
            res.status(404);
            res.json(ordensServico)
        } else {
            res.status(200);
            res.json(ordensServico);
        }
    }
    async createOS(req,res){
        var id = await numeroOs.findOne().sort('asc').select('numero');
        var newID = id.numero + 1;
        await numeroOs.update({numero:newID});
        var {cliente,dataData,equipamento,setor,cCusto,codCcusto,solicitante,refCliente} = await req.body;
        await os.create({cliente,dataData,equipamento,setor,cCusto,codCcusto,solicitante,refCliente,numeroOS:newID});
        res.status(200);
        res.send("OS criada com sucesso!");
    }
    async removerOS(req,res){
        var id = await req.body.id;
        await os.findByIdAndDelete(id);
        res.status(200);
        res.send("OS removida com sucesso!");
    }
    async openOS(req,res){
        var id = await req.params.id;
        var ordensServico = await await os.findById(id).populate('cliente');
        if(ordensServico == undefined){
            res.status(404);
            res.send("Houve um erro a selecionar a OS!");
        }else{
            res.status(200);
            res.json(ordensServico);
        }
    }
    async selectById(req,res){
        var id = await req.params.id;
        var ordensServico = await os.findById(id).populate('cliente');
        if(ordensServico != undefined | ordensServico != null | ordensServico != "" | ordensServico != " "){
            res.json(ordensServico);
            res.status(200);
        }else{
            res.status(404);
            res.send("Erro ao selecionar OS!");
        }        
    }
    async updateById(req,res){
        var id = await req.params.id;
        var ordensServico = await req.body;
        if(ordensServico != undefined | ordensServico != null | ordensServico != "" | ordensServico != " "){
            await os.findByIdAndUpdate(id,ordensServico);
            res.send("Os atualizada com sucesso!");
            res.status(200);
        }else{
            res.status(404);
            res.send("Erro ao atualizar OS!");
        }
    }
    // async findById(req,res) {
    //     var id = req.params.id
    //     var users = await User.findById(id);
    //     if(users == undefined){
    //         res.status(404);
    //         res.json({users});
    //     }else{
    //         res.json({users});
    //     }

    // }
    // async createUser(req,res){
    //     var {email,password,name} = req.body;
    //     if(email == undefined || email == '' || email ==' '){
    //         res.status(400);
    //         res.json({err:"O e-mail é invalido!"});
    //         return;

    //     }
    //     var emailExiste = await User.find({email:email})
    //     if(!emailExiste){
    //         res.status(400);
    //         res.json({err:"O e-mail já está cadastrado!"});
    //         return;
    //     }
    //     await User.create({email,password,name});
    //     res.status(200);
    //     res.send("Usuario cadastrado!");
    // }
}

module.exports = new controllerOrdensServico();