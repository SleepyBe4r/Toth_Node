const Professor_Model = require("../models/professor_model");
const Turma_Model = require("../models/turma_model");
const Serie_Controller = require("./serie_controller");
const Sala_Model = require("../models/sala_model")

class Sala_Controller{
    async listar_view(req, resp){
        let sala_Model = new Sala_Model();
        let lista_salas = await sala_Model.listar();
        resp.render("salas/listar_sala.ejs", { layout: "layout_admin_home.ejs", lista_salas});
    }

    listar_cadastro(req, resp){
        let sala_para_alterar  = undefined;
        resp.render("salas/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", sala_para_alterar });
    }

    async cadastrar_sala(req, resp) {
        if(req.body.sala == "", req.body.qntd_alunos == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let sala_M = new Sala_Model();
        sala_M.sala = req.body.sala;
        sala_M.capacidade_alunos = req.body.qntd_alunos;

        let lista_sala = [];

        lista_sala = await sala_M.inserir();
        if(lista_sala){
            resp.send({
                ok : true,
                msg: "Sala cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir a Sala"
            })
        }
    }
    
    async excluir_ano_letivo(req, resp){
        let sala_M = new Sala_Model();
        sala_M.id = req.body.id;

        let lista_sala = await sala_M.excluir();
        if(lista_sala){
            resp.send({
                ok : true
            })
        } else{            
            resp.send({
                ok : false
            })
        }
    }

    async listar_editar(req, resp){
        const id = req.params.id;
        let sala_M = new Sala_Model();
        let sala_para_alterar = await sala_M.obter(id);
        sala_para_alterar = sala_para_alterar[0];

        resp.render("salas/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", sala_para_alterar});
    }

    async editar_sala(req, resp) {
        if(req.body.sala == "", req.body.qntd_alunos == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let sala_M = new Sala_Model();
        sala_M.id =  req.body.id;
        sala_M.sala = req.body.sala;
        sala_M.capacidade_alunos = req.body.qntd_alunos;

        let lista_sala = [];

        lista_sala = await sala_M.atualizar();
        if(lista_sala){
            resp.send({
                ok : true,
                msg: "Sala editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Sala"
            })
        }
    }
    
}

module.exports = Sala_Controller;