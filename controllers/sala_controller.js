const Professor_Model = require("../models/professor_model");
const Turma_Model = require("../models/turma_model");
const Serie_Controller = require("./serie_controller");
const Sala_Model = require("../models/sala_model")

class Turma_Controller{
    async listar_view(req, resp){
        let sala_Model = new Sala_Model();
        let lista_salas = await sala_Model.listar();
        resp.render("sala/listar_sala.ejs", { layout: "layout_admin_home,ejs", lista_series});
    }

    async cadastrar_sala(req, resp) {
        if(req.body.sala == "", req.body.professor == ""){
            resp.send({
                ok: false,
                msg: "Campo Incompleto"
            })
        return;
        }

    let sala_Model = new Sala_Model();
    sala_Model.professor = req.body.professor;
    sala_Model.turma = req.body.turma;
    sala_Model.hrinicio = req.body.hrinicio;
    sala_Model.hrtermino = req.body.hrtermino;

    let lista_sala = [];

    lista_serie = await sala_Model.inserir();
    if(lista_sala){
        resp.send({
            ok: true,
            msg: "Sala reservada com sucesso"
        })
    } else{
        resp.send({
            ok: false,
            msg: "Erro ao reservar a Sala"
        })
    }
}

    async excluir_sala(req, resp){
        let sala_Model = new Sala_Model();
        sala_Model.id = req.body.id;

        let lista_sala = await sala_Model.excluir();
        if(lista_sala){
            resp.send({
                ok: true
            })
        } else{
            resp.send({
                ok: false
            })
        }
    }
}

module.exports = Serie_Controller;