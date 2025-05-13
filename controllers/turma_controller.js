const Turma_Model = require("../models/turma_model");
const Serie_Model = require("../models/serie_model");

class Turma_Controller{

    async listar_view(req, resp){
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();
        resp.render("turma/listar_turma.ejs", { layout: "layout_admin_home.ejs", lista_turmas});
    }

    async listar_cadastro(req, resp){
        let turma_para_alterar  = undefined;
        resp.render("turma/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", turma_para_alterar});
    }
         
    async cadastrar_turma(req, resp) {
        if(req.body.turma == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let turma_M = new Turma_Model();
        turma_M.turma = req.body.turma;

        let lista_turma = [];

        lista_turma = await turma_M.inserir();
        if(lista_turma){
            resp.send({
                ok : true,
                msg: "Turma cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir a Turma"
            })
        }
    }
    
    async excluir_turma(req, resp){
        let turma_M = new Turma_Model();
        turma_M.id = req.body.id;

        let lista_turma = await turma_M.excluir();
        if(lista_turma){
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
        let turma_M = new Turma_Model();
        let turma_para_alterar = await turma_M.obter(id);
        turma_para_alterar = turma_para_alterar[0];

        resp.render("turma/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", turma_para_alterar});
    }

    async editar_turma(req, resp) {
        if(req.body.turma == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let turma_M = new Turma_Model();
        turma_M.id =  req.body.id;
        turma_M.turma = req.body.turma;

        let lista_turma = [];

        lista_turma = await turma_M.atualizar();
        if(lista_turma){
            resp.send({
                ok : true,
                msg: "Turma editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Turma"
            })
        }
    }

    async ObterPorDisc(req, resp){ //arrumar
        let cpf = req.cookies.usuario_Logado;
        let id = req.body.id_disciplina;
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.obterPorProf(id, cpf);
        let lista = [];
        lista_turmas.forEach(e=>{
            lista.push({
                id: e["id"],
                nome: `${e["serie"]} - ${e["turma"]} - ${e["ano_letivo"]}`
            });
        })
        
        resp.send({
            ok : true,
            lista: lista 
        })
    }
    
}

module.exports = Turma_Controller;