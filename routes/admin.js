const { Router, response } = require("express");
const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
require("../models/OS");
require("../models/Material");
require("../models/Servico");
require("../models/Id");
require("../models/Cliente");
const id = mongoose.model("id")
const OS = mongoose.model("os")
const Servico = mongoose.model("servicos")
const Material = mongoose.model("materiais")
const Cliente = mongoose.model("cliente")
const fs = require("fs");
const pdf = require("html-pdf");
const e = require("express");
const { compile } = require("handlebars");



//PAGAR MUITOS
router.post("/pagamentos", function (req, res) {
    if (req.body.all == undefined) {
        OS.updateMany({ _id: req.body.pagar }, { pagamento: "FINALIZADO" }).then(function () {
            Cliente.find().lean().then(function (clientes) {
                res.render("admin/relatorio/pagamentos", { cliente: clientes })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/relatoriopagamentos")
            })
        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/relatoriopagamentos")
        })
    } else {
        var obj = req.body.all.split(" ")
        obj.pop();
        OS.updateMany({ _id: obj }, { pagamento: "FINALIZADO" }).then(function () {
            Cliente.find().lean().then(function (clientes) {
                res.render("admin/relatorio/pagamentos", { cliente: clientes })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/relatoriopagamentos")
            })
        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/relatoriopagamentos")
        })
    }

})
//GERAR RELATORIO DE PAGAMENTOS 
router.get("/relatorio_pagamento", function (req, res) {
    function download() {
        res.download("./pdfs/relatorios/relatorio.pdf")

    }
    setTimeout(download, 3000);
})
router.get("/relatoriopagamentodetalhado", function (req, res) {
    function download() {
        res.download("./pdfs/relatorios/relatoriodetalhado.pdf")

    }
    setTimeout(download, 3000);
})
//EDITAR CLIENTE
router.get("/editarcliente/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Cliente.findById(req.params.id).lean().then(function (cliente) {
            res.render("admin/clientes/editar", { cliente: cliente })
        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/orcamentos")
        })
    } else {
        res.redirect("/admin/orcamentos")
    }
})
router.post("/editar/cliente/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Cliente.findByIdAndUpdate(req.params.id, { nome: req.body.nome.toUpperCase(), cnpj: req.body.cnpj.toUpperCase(), endereco: req.body.endereco.toUpperCase(), telefone: req.body.telefone.toUpperCase(), email: req.body.email.toUpperCase() }).then(function () {
            res.redirect("/admin/clientes")
        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/clientes")
        })
    } else {
        res.redirect("/admin/clientes")
    }
})
//EDITAR OS 
router.get("/editaros/:id", function (req, res) {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        OS.findById(req.params.id).populate("cliente").lean().then(function (os) {
            Cliente.find().lean().then(function (clientes) {

                res.render("admin/os/editar", { os: os, clientes: clientes })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })

        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/orcamentos")
        })
    } else {
        res.redirect("/admin/orcamentos")
    }
})
router.post("/editar/os/:id", function (req, res) {
    console.log(req.body.novaData)
    var data = req.body.novaData.split("-")
    var dia = data[2]
    var mes = data[1]
    var ano = data[0]
    var dataFormatada = dia + "/" + mes + "/" + ano
    console.log(dataFormatada)
    console.log(dia)
    if (dia == undefined) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            OS.findByIdAndUpdate(req.params.id, { equipamento: req.body.equipamento.toUpperCase(), setor: req.body.setor.toUpperCase(), cCusto: req.body.cCusto.toUpperCase(), codCcusto: req.body.codCcusto.toUpperCase(), solicitante: req.body.solicitante.toUpperCase(), refCliente: req.body.refCliente.toUpperCase(), cliente: req.body.cliente, diaSemana: req.body.diaSemana.toUpperCase() }).then(function () {
                res.redirect("/admin/orcamentos")
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })

        } else {
            res.redirect("/admin/orcamentos")
        }
    } else {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            OS.findByIdAndUpdate(req.params.id, { equipamento: req.body.equipamento.toUpperCase(), setor: req.body.setor.toUpperCase(), cCusto: req.body.cCusto.toUpperCase(), codCcusto: req.body.codCcusto.toUpperCase(), solicitante: req.body.solicitante.toUpperCase(), refCliente: req.body.refCliente.toUpperCase(), cliente: req.body.cliente, diaSemana: req.body.diaSemana.toUpperCase(), dataData: req.body.novaData, data: dataFormatada }).then(function () {
                res.redirect("/admin/orcamentos")
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })

        } else {
            res.redirect("/admin/orcamentos")
        }
    }
})
//RELATORIO DE PAGAMENTOS
router.get("/relatoriopagamentos", function (req, res) {
    Cliente.find().lean().then(function (clientes) {
        res.render("admin/relatorio/pagamentos", { cliente: clientes })
    }).catch(function (err) {
        console.log(err)
        res.redirect("/admin/orcamentos")
    })

})
//FILTRO PAGAMENTOS
router.post("/filtrarpagamentos", function (req, res) {
    console.log(req.body.idCliente)
    var teste = parseInt(req.body.campo)
    var serv = req.body.camposervico
    var filtro = 0
    if (req.body.datain > req.body.datafinal) {
        filtro++;
    }
    if (filtro > 0) {
        res.redirect("/admin/relatoriopagamentos")
    } else if (req.body.idCliente == "null") {
        if (serv == "null") {
            if (teste == 1) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })

                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;

                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })

                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        } else if (serv == "FINALIZADO") {
            if (teste == 1) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO", status: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;

                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE", status: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;

                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        } else if (serv == "PENDENTE") {
            if (teste == 1) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO", status: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;

                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE", status: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;

                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatorio_pagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2)}, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        }

    } else {
        if (serv == "null") {
            if (teste == 1) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))

                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })

                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))
                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        } else if (serv == "FINALIZADO") {
            if (teste == 1) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO", status: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))
                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE", status: "FINALIZADO" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))
                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        } else if (serv == "PENDENTE") {
            if (teste == 1) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "FINALIZADO", status: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))
                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 2) {
                OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: "PENDENTE", status: "PENDENTE" }).populate("cliente").lean().then(function (os) {
                    Cliente.find().lean().then(function (clientes) {
                        var cont = 0;
                        var valor = 0;
                        var cliente = os[0].cliente.nome
                        var valorString = 0;
                        while (cont < os.length) {
                            valorString = os[cont].valor
                            valor = valor + os[cont].valor
                            os[cont].valorString = valorString.toFixed(2)
                            cont++
                        }
                        res.render("pdfs/relatoriopagamento", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente }, function (erro, html) {
                            pdf.create(html, {}).toFile("./pdfs/relatorios/relatorio.pdf", (function (erro, res) {
                                if (erro) {
                                    console.log(erro)
                                } else {

                                    console.log(res)
                                }
                            }))
                        })
                        var data = req.body.datain.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var datainicial = dia + "/" + mes + "/" + ano
                        var data = req.body.datafinal.split("-")
                        var dia = data[2]
                        var mes = data[1]
                        var ano = data[0]
                        var dataifinal = dia + "/" + mes + "/" + ano
                        res.render("pdfs/relatoriodetalhado", { layout: "other", orcamentos: os, total: valor.toFixed(2), cliente: cliente, dataincial: datainicial, datafinal: dataifinal }, function (erro, html) {
                            if (erro) {
                                console.log(erro)

                                res.redirect("/admin/relatoriopagamentos")
                            } else {
                                pdf.create(html, {}).toFile("./pdfs/relatorios/relatoriodetalhado.pdf", (function (erro, res) {
                                    if (erro) {
                                        console.log(erro)
                                    } else {
                                        console.log(res)
                                    }
                                }))
                            }
                        })
                        res.render("admin/relatorio/pagamentos", { cliente: clientes, orcamentos: os, soma: valor.toFixed(2), teste: os })
                    }).catch((function (err) {
                        console.log(err)
                        res.redirect("/admin/relatoriopagamentos")
                    }))
                }).catch((function (err) {
                    console.log(err)
                    res.redirect("/admin/relatoriopagamentos")
                }))
            } else if (teste == 0) {
                res.redirect("/admin/relatoriopagamentos")
            }
        }
    }

})
//PAGAMENTO
router.get("/pagamento/:id", function (req, res) {

    OS.findOne({ _id: req.params.id }).populate("cliente").lean().then(function (os) {
        console.log(os.status)
        if (os.status == "PENDENTE") {
            req.flash("error_msg", "Para pagar a OS deve estar com Status finalizado...")
            res.redirect("/admin/orcamentoAberto/" + req.params.id)
        } else {
            OS.findOneAndUpdate(os, { pagamento: "FINALIZADO" }).then(function () {
                res.redirect("/admin/orcamentoAberto/" + req.params.id)
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })

        }
    }).catch(function (err) {
        console.log(err)
        res.redirect("/admin/orcamentos")
    })
})
//DELETAR CLIENTE
router.get("/deletarCliente/:id", function (req, res) {
    OS.exists({ cliente: req.params.id }, function (err, bol) {
        if (bol == true) {
            res.redirect("/admin/orcamentos")
        } else if (err) {
            console.log("Erro ao procurar: " + err)
        } else {
            Cliente.findByIdAndDelete(req.params.id).then(function () {
                res.redirect("/admin/clientes")
            }).catch(function (erro) {
                console.log(erro)
                res.redirect("/admin/clientes")
            })
        }
    })
})
//CLIENTE ABERTO    
router.get("/clienteAberto/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Cliente.findById(req.params.id).lean().then(function (cliente) {

            res.render("admin/clienteAberto", { cliente: cliente })

        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/clientes")
        })
    } else {
        res.redirect("/admin/clientes")
    }
})
//LISTAR CLIENTES 
router.get("/clientes", function (req, res) {
    Cliente.find().lean().then(function (clientes) {
        res.render("admin/clientes", { clientes: clientes })
    }).catch(function (erro) {
        console.log(erro)
        res.redirect("admin/clientes")
    })
})
//ADD CLIENTE
router.get("/cadastrarcliente", function (req, res) {
    res.render("admin/addcliente")
})
router.post("/clientenovo", function (req, res) {
    const novoCliente = {
        nome: req.body.nome.toUpperCase(),
        cnpj: req.body.cnpj.toUpperCase(),
        endereco: req.body.endereco.toUpperCase(),
        telefone: req.body.telefone.toUpperCase(),
        email: req.body.email.toUpperCase()
    }
    new Cliente(novoCliente).save().then(function () {
        res.redirect("/admin/clientes")
    }).catch(function (erro) {
        console.log(erro)
        res.redirect("/admin/clientes")
    })
})
//BUSCAR ORDEM
router.post("/buscardata", function (req, res) {
    if (req.body.datain > req.body.datafinal) {
        res.redirect("/admin/orcamentos")
    } else {
        OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal } }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (err) {
            res.redirect("/admin/orcamentos")
            console.log(err)
        })
    }
})
router.post("/buscarcliente", function (req, res) {
    OS.find({ cliente: req.body.idCliente }).populate("cliente").lean().then(function (os) {
        res.render("admin/orcamentos", { orcamentos: os })
    }).catch(function (err) {
        console.log(err)
        res.redirect("/admin/orcamentos")
    })
})
router.post("/buscarporcampo", function (req, res) {
    if (req.body.campo == 1) {
        if (isNaN(req.body.pesquisa)) {
            res.redirect("/admin/orcamentos")
        } else {
            OS.find({ numeroOS: req.body.pesquisa }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (erro) {
                console.log(erro)
                res.redirect("/admin/orcamentos")
            })
        }
    } else if (req.body.campo == 2) {
        OS.find({ equipamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if (req.body.campo == 3) {
        OS.find({ setor: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if (req.body.campo == 4) {
        OS.find({ cCusto: req.body.pesquisa }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if (req.body.campo == 5) {
        OS.find({ codCcusto: req.body.pesquisa }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if (req.body.campo == 6) {
        OS.find({ solicitante: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if (req.body.campo == 7) {
        OS.find({ refCliente: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
            res.render("admin/orcamentos", { orcamentos: os })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })

    } else if(req.body.campo == 8){
        var arrayServico = [];
       Servico.find({descricao:{$regex: req.body.pesquisa.toUpperCase()}}).select("os").then(function(servicos){ 
        servicos.forEach(servico => {
               arrayServico.push(servico.os)
           });
        OS.find({_id:{$in:arrayServico}}).populate('cliente').lean().then(function(os){
            res.render("admin/orcamentos", { orcamentos: os });
        }).catch(function(err){
            res.redirect("/admin/orcamentos")
        console.log("Erro ao selcionar por servico: " + err);
        });
       }).catch(function(err){
        res.redirect("/admin/orcamentos")
        console.log("Erro ao selcionar por servico: " + err);
       });
    }else if(req.body.campo == 9){
        var arrayMaterial = [];
        Material.find({nome:{$regex: req.body.pesquisa.toUpperCase()}}).select("os").then(function(materiais){ 
         materiais.forEach(material => {
                arrayMaterial.push(material.os)
            });
         OS.find({_id:{$in:arrayMaterial}}).populate('cliente').lean().then(function(os){
             res.render("admin/orcamentos", { orcamentos: os });
         }).catch(function(err){
             res.redirect("/admin/orcamentos")
         console.log("Erro ao selcionar por servico: " + err);
         });
        }).catch(function(err){
         res.redirect("/admin/orcamentos")
         console.log("Erro ao selcionar por servico: " + err);
        });
    }else if (req.body.campo == 0) {
        res.redirect("/admin/orcamentos")
    }




})
router.post("/filtro", function (req, res) {
    var filtro = 0
    var teste = parseInt(req.body.campo)
    if (req.body.datain > req.body.datafinal) {
        filtro++;
    }
    if (filtro > 0) {
        res.redirect("/admin/orcamentos")
    } else if (req.body.idCliente == "null") {
        if (teste == 1) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, equipamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 2) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, setor: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 3) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, cCusto: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 4) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, codCcusto: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 5) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, solicitante: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 6) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, equipamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 7) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, status: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 8) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        }
        else if (teste == 0) {
            OS.find({ dataData: { $gte: req.body.datain, $lte: req.body.datafinal } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        }

    } else {
        if (teste == 1) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, equipamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 2) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, setor: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 3) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, cCusto: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 4) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, codCcusto: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 5) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, solicitante: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 6) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, equipamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 7) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, status: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else if (teste == 8) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal }, pagamento: { $regex: req.body.pesquisa.toUpperCase() } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        }
        else if (teste == 0) {
            OS.find({ cliente: req.body.idCliente, dataData: { $gte: req.body.datain, $lte: req.body.datafinal } }).populate("cliente").lean().then(function (os) {
                res.render("admin/orcamentos", { orcamentos: os })
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        }


    }
})
//LISTAR ORDENS DE SERVICO
router.get("/orcamentos", function (req, res) {
    OS.find({status:"PENDENTE"}).sort({numeroOS:'desc'}).populate("cliente").lean().then(function (orcamentos) {
        Cliente.find().lean().then(function (cliente) {
            res.render("admin/orcamentos", { orcamentos: orcamentos, cliente: cliente })
        })

    }).catch(function (erro) {
        console.log(erro)
        res.redirect("admin/index")
    })
})
//ORDEM DE SERVICO ABERTA 
router.get("/orcamentoAberto/:id", function (req, res) {
    OS.findById(req.params.id).populate("cliente").lean().then(function (orcamento) {
        Servico.find({ os: orcamento._id }).populate("os").lean().then(function (servicos) {
            Material.find({ os: orcamento._id }).populate("os").lean().then(function (materiais) {
                var cont = 0;
                var valor = 0;
                var valorString = 0;
                var valorHoraString = 0;
                var valorMaterialString = 0;
                while (cont < servicos.length) {
                    valorString = servicos[cont].valor
                    valorHoraString = servicos[cont].valorHora
                    valor = valor + servicos[cont].valor
                    servicos[cont].valorString = valorString.toFixed(2)
                    servicos[cont].valorHoraString = valorHoraString.toFixed(2)
                    cont++
                }
                cont = 0;
                while (cont < materiais.length) {
                    valorMaterialString = materiais[cont].valor
                    valor = valor + materiais[cont].valor
                    materiais[cont].valorString = valorMaterialString.toFixed(2)
                    cont++
                }
                res.render("admin/orcamentoAberto", { orcamento: orcamento, servicos: servicos, materiais: materiais, valor: valor.toFixed(2) })

            })
        })
    }).catch(function (erro) {
        res.redirect("admin/orcamentos")
    })
})
//GERAR ORÇAMENTO
router.get("/pdforcamento/:id/:valor", function (req, res) {
    OS.findById(req.params.id).populate("cliente").lean().then(function (orcamento) {
        Servico.find({ os: orcamento._id }).populate("os").lean().then(function (servicos) {
            Material.find({ os: orcamento._id }).populate("os").lean().then(function (materiais) {
                var numeroOC = orcamento.numeroOS
                var cont = 0;
                var valorString = 0;
                var valorHoraString = 0;
                var valorMaterialString = 0;
                while (cont < servicos.length) {
                    valorString = servicos[cont].valor
                    valorHoraString = servicos[cont].valorHora
                    servicos[cont].valorString = valorString.toFixed(2)
                    servicos[cont].valorHoraString = valorHoraString.toFixed(2)
                    cont++
                }
                cont = 0;
                while (cont < materiais.length) {
                    valorMaterialString = materiais[cont].valor
                    materiais[cont].valorString = valorMaterialString.toFixed(2)
                    cont++
                }
                res.render("pdfs/orcamentoTT", { layout: "other", orcamento: orcamento, servicos: servicos, materiais: materiais, total: req.params.valor }, function (erro, html) {
                    pdf.create(html, {}).toFile("./pdfs/orçamentos/" + numeroOC + ".pdf", (function (erro, res) {
                        if (erro) {
                            console.log(erro)
                        } else {
                            console.log(res)
                        }
                    }))
                    res.redirect("/admin/download/" + numeroOC)
                })
            })
        })
    }).catch(function (erro) {
        res.redirect("admin/orcamentos")
    })




})
router.get("/download/:numeroOC", function (req, res) {

    res.type('pdf')
    function download() {
        res.download("./pdfs/orçamentos/" + req.params.numeroOC + ".pdf")
        deletar
    }
    function deletar() {
        fs.unlink("./pdfs/orçamentos/" + req.params.numeroOC + ".pdf", function (err) {
            if (err) {
                console.log(err)
            }
            console.log("Deletado")
        })
    }
    setTimeout(download, 3000);
    setTimeout(deletar, 4500);
})
//GERAR ORDEM INTERNA
router.get("/pdfordeminterna/:id", function (req, res) {
    OS.findById(req.params.id).populate("cliente").lean().then(function (orcamento) {
        Servico.find({ os: orcamento._id }).populate("os").lean().then(function (servicos) {
            Material.find({ os: orcamento._id }).populate("os").lean().then(function (materiais) {
                var tam = servicos.length
                tam = 22 - tam

                var linhas = []
                while (tam > 0) {
                    linhas.push({ text: null })
                    tam--
                }
                var tamMat = materiais.length
                tamMat = 9 - tamMat
                var linhasMat = []
                while (tamMat > 0) {
                    linhasMat.push({ text: null })
                    tamMat--
                }
                res.render("pdfs/ordemInterna", { layout: "other", orcamento: orcamento, servicos: servicos, materiais: materiais, linhas: linhas, linhasMat: linhasMat }, function (erro, html) {
                    pdf.create(html, {}).toFile("./pdfs/osinterna/osinterna.pdf", (function (erro, res) {
                        if (erro) {
                            console.log(erro)
                        } else {
                            console.log(res)
                        }
                    }))
                })
            })
        })
    }).catch(function (erro) {
        res.redirect("admin/orcamentos")
    })

    res.redirect("/admin/downloadinterna")


})
router.get("/downloadinterna", function (req, res) {

    res.type('pdf')
    function download() {
        res.download("./pdfs/osinterna/osinterna.pdf")
    }

    setTimeout(download, 3000);
})
//PEDENTE OS 
router.get("/pendente/:id", function (req, res) {
    OS.findByIdAndUpdate(req.params.id, { status: "PENDENTE" }).lean().then(function (orcamento) {
        res.redirect("/admin/orcamentoAberto/" + req.params.id)
    }).catch(function (err) {
        res.redirect("/admin/orcamentos")
        console.log(err)
    })
})
//GERAR ORDEM SERVICO FINAL 
router.get("/gravaros/:id/:valor", function (req, res) {
    OS.findByIdAndUpdate(req.params.id, { valor: req.params.valor, status: "FINALIZADO" }).lean().then(function (orcamento) {
        res.redirect("/admin/pdfordemfinal/" + req.params.id + "/" + req.params.valor)
    }).catch(function (err) {
        res.redirect("/admin/orcamentos")
        console.log(err)
    })
})
router.get("/pdfordemfinal/:id/:valor", function (req, res) {
    OS.findById(req.params.id).populate("cliente").lean().then(function (orcamento) {
        Servico.find({ os: orcamento._id }).populate("os").lean().then(function (servicos) {
            Material.find({ os: orcamento._id }).populate("os").lean().then(function (materiais) {
                var numeroOS = orcamento.numeroOS
                var cont = 0;
                var valorString = 0;
                var valorHoraString = 0;
                var valorMaterialString = 0;
                while (cont < servicos.length) {
                    valorString = servicos[cont].valor
                    valorHoraString = servicos[cont].valorHora
                    servicos[cont].valorString = valorString.toFixed(2)
                    servicos[cont].valorHoraString = valorHoraString.toFixed(2)
                    cont++
                }
                cont = 0;
                while (cont < materiais.length) {
                    valorMaterialString = materiais[cont].valor
                    materiais[cont].valorString = valorMaterialString.toFixed(2)
                    cont++
                }
                res.render("pdfs/ordemFinal", { layout: "other", orcamento: orcamento, servicos: servicos, materiais: materiais, total: req.params.valor }, function (erro, html) {

                    pdf.create(html, {}).toFile("./pdfs/osfinal/" + numeroOS + ".pdf", (function (erro, res) {
                        if (erro) {
                            console.log(erro)
                        } else {

                            console.log(res)
                        }
                    }))
                    res.redirect("/admin/downloadfinal/" + numeroOS)
                })
            })
        })
    }).catch(function (erro) {
        res.redirect("admin/orcamentos")
    })




})
router.get("/downloadfinal/:numeroOS", function (req, res) {

    res.type('pdf')
    function download() {
        res.download("./pdfs/osfinal/" + req.params.numeroOS + ".pdf")
        deletar
    }
    function deletar() {
        fs.unlink("./pdfs/osfinal/" + req.params.numeroOS + ".pdf", function (err) {
            if (err) {
                console.log(err)
            }
            console.log("Deletado")
        })
    }
    setTimeout(download, 3000);
    setTimeout(deletar, 4500);
})
//GERAR ORDEM FINAL SEM HORA
router.get("/gravarossemhora/:id/:valor", function (req, res) {
    OS.findByIdAndUpdate(req.params.id, { valor: req.params.valor, status: "FINALIZADO" }).lean().then(function (orcamento) {
        res.redirect("/admin/pdfordemfinalsemhora/" + req.params.id + "/" + req.params.valor)
    }).catch(function (err) {
        res.redirect("/admin/orcamentos")
        console.log(err)
    })
})
router.get("/pdfordemfinalsemhora/:id/:valor", function (req, res) {
    OS.findById(req.params.id).populate("cliente").lean().then(function (orcamento) {
        Servico.find({ os: orcamento._id }).populate("os").lean().then(function (servicos) {
            Material.find({ os: orcamento._id }).populate("os").lean().then(function (materiais) {
                var numeroOS = orcamento.numeroOS
                var cont = 0;
                var valorString = 0;
                var valorHoraString = 0;
                var valorMaterialString = 0;
                while (cont < servicos.length) {
                    valorString = servicos[cont].valor
                    valorHoraString = servicos[cont].valorHora
                    servicos[cont].valorString = valorString.toFixed(2)
                    servicos[cont].valorHoraString = valorHoraString.toFixed(2)
                    cont++
                }
                cont = 0;
                while (cont < materiais.length) {
                    valorMaterialString = materiais[cont].valor
                    materiais[cont].valorString = valorMaterialString.toFixed(2)
                    cont++
                }
                res.render("pdfs/ordemFinalSemHora", { layout: "other", orcamento: orcamento, servicos: servicos, materiais: materiais, total: req.params.valor }, function (erro, html) {
                    pdf.create(html, {}).toFile("./pdfs/osfinal/" + numeroOS + ".pdf", (function (erro, res) {

                        if (erro) {
                            console.log(erro)
                        } else {
                            console.log(res)
                        }
                    }))
                    res.redirect("/admin/downloadfinal/" + numeroOS)
                })
            })
        })
    }).catch(function (erro) {
        console.log(erro)
        res.redirect("admin/orcamentos")
    })




})
router.get("/downloadfinal/:numeroOS", function (req, res) {
    res.type('pdf')
    function download() {
        res.download("./pdfs/osfinal/" + req.params.numeroOS + ".pdf")
        deletar
    }
    function deletar() {
        fs.unlink("./pdfs/osfinal/" + req.params.numeroOS + ".pdf", function (err) {
            if (err) {
                console.log(err)
            }
            console.log(Deletado)
        })
    }
    setTimeout(download, 3000);
    setTimeout(deletar, 4500);
})
//ADD ORDEM DE SERVICO
router.get("/orcamento", function (req, res) {
    Cliente.find().lean().then(function (cliente) {
        res.render("admin/orcamento", { cliente: cliente })
    }).catch(function (erro) {
        res.redirect("/admin/orcamentos")
    })

})
router.post("/orcamento/novo", function (req, res) {
    var data = req.body.data.split("-")
    var dia = data[2]
    var mes = data[1]
    var ano = data[0]
    var dataFormatada = dia + "/" + mes + "/" + ano
    if (req.body.cliente == "null") {
        res.redirect("/admin/orcamento")
    } else {





        id.findOne({ nome: "OS" }).then(function (num) {
            console.log(num._id)
            num.numero++
            num.save()
            const novoOrcamento = {
                dataData: req.body.data,
                numeroOS: num.numero,
                data: dataFormatada,
                cliente: req.body.cliente,
                equipamento: req.body.equipamento.toUpperCase(),
                setor: req.body.setor.toUpperCase(),
                cCusto: req.body.cCusto.toUpperCase(),
                codCcusto: req.body.codCcusto.toUpperCase(),
                solicitante: req.body.solicitante.toUpperCase(),
                refCliente: req.body.refCliente.toUpperCase(),
                diaSemana: req.body.diaSemana.toUpperCase()
            }

            new OS(novoOrcamento).save().then(function () {
                res.redirect("/admin/orcamentos")
            }).catch(function (erro) {
                console.log(erro)
                req.flash("erro_msg", "Erro ao abrir orcamento tente novamente...")

            })
        }).catch(function (erro) {
            console.log(erro)
            res.redirect("/admin/orcamentos")
        })
    }

})
//REMOVER SERVICO
router.get("/deletarservico/:id", function (req, res) {
    Servico.findByIdAndDelete(req.params.id).then(function (servico) {
        res.redirect("/admin/orcamentoAberto/" + servico.os)
    }).catch(function (erro) {
        res.redirect("/admin/orcamentos")
        console.log(erro)
    })
})
//EDITAR SERVICO
router.get("/editarservico/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Servico.findById(req.params.id).lean().then(function (servico) {
            res.render("admin/servico/editar", { servico })
        }).catch(function (err) {
            res.redirect("/admin/orcamentos")
            console.log(err)
        })
    } else {
        res.redirect("/admin/orcamentos")
    }
})
router.post("/servico/editar/:id", function (req, res) {
    var horas = req.body.horas
    var x = req.body.valorHora.replace(',','.')
    horas.split('')
    console.log(x)
    var horaIn = horas[0];
    horaIn += horas[1];
    var min = horas[3];
    min += horas[4];
    var x = parseFloat(horaIn)
    var y = parseFloat(min)
    var total = x * req.body.valorHora.replace(',','.')
    total += (y / 60) * req.body.valorHora.replace(',','.')
    if (isNaN(req.body.valorHora.replace(',','.')) || isNaN(x, y)) {
        res.redirect("/admin/orcamento/servico/" + req.body.id_OS)
    } else {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            Servico.findByIdAndUpdate(req.params.id, { descricao: req.body.descricao.toUpperCase(), horas: req.body.horas.toUpperCase(), valorHora: req.body.valorHora.replace(',','.'), valor: total.toFixed(2) }).then(function () {
                res.redirect("/admin/orcamentoAberto/" + req.body.id_OS)
            }).catch(function (err) {
                console.log(err)
                res.redirect("/admin/orcamentos")
            })
        } else {
            res.redirect("/admin/orcamentoAberto/" + req.body.id_OS)
        }
    }

})
//DELETAR ORCAMENTO
router.get("/delete/:id", function (req, res) {
    OS.findByIdAndDelete(req.params.id).then(function () {
        res.redirect("/admin/orcamentos")
    }).catch(function (erro) {
        console.log(erro)
        res.redirect("/admin/orcamentos")
    })
})
//ADD SERVICO
router.get("/orcamento/servico/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        OS.findById(req.params.id).lean().then(function (os) {
            res.render("admin/servico", { os: os })

        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/orcamentos")
        })
    } else {
        res.redirect("/admin/orcamentos")
    }

})
router.post("/orcamento/servicoAdd", function (req, res) {
    var horas = req.body.horas
    var valorHoras = req.body.valorHora
    var xy = valorHoras.replace(',','.')
    var total = 0;
    console.log(total.toFixed(2))
    console.log(valorHoras)
    console.log(xy)
    horas.split('')
    var horaIn = horas[0];
    horaIn += horas[1];
    var min = horas[3];
    min += horas[4];
    var x = parseFloat(horaIn)
    var y = parseFloat(min)
    total = x * xy
    total += (y / 60.00) * xy
    if (isNaN(xy) || isNaN(x, y)) {
        res.redirect("/admin/orcamento/servico/" + req.body.id_OS)
    } else {
        const novoServico = {
            descricao: req.body.descricao.toUpperCase(),
            horas: req.body.horas,
            valor: total.toFixed(2),
            os: req.body.id_OS,
            valorHora: xy,
        }
        new Servico(novoServico).save().then(function () {
            res.redirect("/admin/orcamentoAberto/" + req.body.id_OS)
        }).catch(function (erro) {
            res.redirect("/admin/orcamentos")
            console.log(erro)
        })
    }
})
//ADD MATERIAL 
router.get("/orcamento/material/:id", function (req, res) {
    OS.findById(req.params.id).lean().then(function (orcamento) {
        res.render("admin/material", { orcamento: orcamento })
    }).catch(function (erro) {
        res.redirect("admin/orcamentos")
    })
})
router.post("/orcamento/materialnovo", function (req, res) {
    if (isNaN(req.body.valor.replace(',','.'))) {
        res.redirect("/admin/orcamentoAberto/" + req.body.idOS)
    } else {
        const novoMaterial = {
            nome: req.body.nome.toUpperCase(),
            quantidade: req.body.quantidade,
            valor: req.body.valor.replace(',','.'),
            os: req.body.idOS
        }
        new Material(novoMaterial).save().then(function () {
            res.redirect("/admin/orcamentoAberto/" + req.body.idOS)
        }).catch(function (erro) {
            res.redirect("/admin/orcamentos")
            console.log(erro)
        })
    }
})
//DELETAR MATERIAL
router.get("/deletarmaterial/:id", function (req, res) {
    Material.findByIdAndDelete(req.params.id).then(function (material) {
        res.redirect("/admin/orcamentoAberto/" + material.os)
    }).catch(function (erro) {
        console.log(erro)
        res.redirect("/admin/orcamentos")
    })
})
//EDITAR MATERIAL
router.get("/editarmaterial/:id", function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Material.findById(req.params.id).lean().then(function (material) {
            res.render("admin/material/editar", { material })
        }).catch(function (err) {
            console.log(err)
            res.redirect("/admin/orcamentos")
        })
    } else {
        res.redirect("/admin/orcamentos")
    }
})
router.post("/material/editar/:id", function (req, res) {
    var valor = req.body.valor.replace(',','.')
    var nome = req.body.nome.toUpperCase()
    if (isNaN(valor)) {
        res.redirect("/admin/editarmaterial/" + req.params.id)
    } else {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            Material.findByIdAndUpdate(req.params.id, { nome: nome, quantidade: req.body.quantidade, valor: valor }).then(function () {
                res.redirect("/admin/orcamentoAberto/" + req.body.idOS)
            }).catch(function (err) {
                console.log(err)
                res.redirect("admin/orcamentos")
            })
        } else {
            res.redirect("admin/orcamentos")
        }
    }
})
module.exports = router