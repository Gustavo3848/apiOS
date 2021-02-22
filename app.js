//CARREGANDO MODULOS 
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const admin = require("./routes/admin");
const ordensServico = require("./routes/ordensServico")
const clientes = require('./routes/clientes')
const servicos = require('./routes/servicos')
const materiais = require('./routes/materiais')
const mongoose = require('mongoose');
const session = require("express-session");
const flash = require("connect-flash");
const { RSA_NO_PADDING } = require('constants');
const { appendFileSync } = require('fs');
const cors = require('cors')
//CONFIGURACOES 
//SESSION
app.use(session({
    secret: "qualquercoisa",
    resave: true,
    saveUninitialized: true
}))
//CORS
app.use(cors())
//FLASH
app.use(flash())
//MIDDLEWARE
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next();
})
//BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//HANDLEBARS
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
//MONGOOSE
mongoose.connect("mongodb://localhost/blog").then(function () {
    console.log("Conectado com o banco de dados...")
}).catch(function (erro) {
    console.log("Erro ao conectar com o bando de dados: " + erro)
})

//PUBLIC 
app.use(express.static(path.join(__dirname, "public")))
//ROTAS
app.get("/404", function (req, res) {
    res.send("Erro 404 - por favor tente mais tarde")
})
app.get("/",function(req,res){
    res.render("index")
})

app.use("/admin", admin);
app.use("/ordensservico", ordensServico);
app.use('/clientes', clientes);
app.use('/servicos', servicos);
app.use('/materiais',materiais);
//mongodb://localhost/blog mongo link
//mongodb://gustavo3848:rerogu361@mongo_sistema:27017/sistema
//OUTROS
const port = 3000;
app.listen(port, function () {
    console.log("Servidor rodando...")
})