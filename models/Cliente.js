const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cliente = new Schema({
    nome: {
        type: String   
    },
    cnpj:{
        type:String
    },
    endereco:{
        type:String
    },
    telefone:{
        type:String
    },
    email:{
        type:String
    }
})
mongoose.model("cliente", Cliente)