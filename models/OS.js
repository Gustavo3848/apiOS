const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OS = new Schema({
    
   
    data:{
        type: String
    },
    dataData:{
        type: Date
    },
    numeroOS:{
        type: Number,
    },
    cliente:{
        type: Schema.Types.ObjectId,
        ref:"cliente"
    },
    equipamento:{
        type: String,
    },
    setor:{
        type: String
    },
    cCusto:{
        type: String
    },
    codCcusto:{
        type: String
    },
    solicitante:{
        type: String
    },
    refCliente:{
        type: String
    },
    status:{
        type: String,
        default: "PENDENTE"
    }, 
    valor:{
        type: Number,
        default:0 
    },
    pagamento:{
        type: String,
        default:"PENDENTE"
    },
    diaSemana:{
        type: String
    },
    valorString:{
        type: String
    }
    
})
mongoose.model("os",OS)