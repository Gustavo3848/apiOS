const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const id = new Schema({
    numero: {
        type: Number
    },
    nome:{
        type:String
    }
})
mongoose.model("id", id)
