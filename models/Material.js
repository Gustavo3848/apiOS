const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Material = new Schema({
  

    nome: {
        type: String,
        
    },
    quantidade: {
        type: Number,
    },
    valor: {
        type: Number,
    },
    os:{
        type: Schema.Types.ObjectId,
        ref: "os",
    },
    valorString:{
        type: String
    }

})
mongoose.model("materiais", Material)