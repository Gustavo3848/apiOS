const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Servico = new Schema({
  

    descricao: {
        type: String
    },
    horas: {
        type: String,
    },
    valor: {
        type: Number
    },
    os:{
        type: Schema.Types.ObjectId,
        ref: "os",
    }, 
    valorHora:{
        type: Number
    },
    valorString:{
        type: String
    },
    valorHoraStrig:{
        type: String
    }
})
mongoose.model("servicos", Servico)