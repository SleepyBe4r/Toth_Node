const Disciplina_Model = require("../models/disciplina_model");
const Turma_Model = require("../models/turma_model");

class Grade_Curricular_Controller{

    // async listar_view(req, resp){
    //     let ano_letivo_M = new Ano_Letivo_Model();
    //     let lista_anos = await ano_letivo_M.listar();
    //     resp.render("ano_letivo/listar_ano_letivo.ejs", { layout: "layout_admin_home.ejs", lista_anos});
    // }

    async listar_cadastro(req, resp){
        let grade_curricular_para_alterar  = undefined;
        let turma_M = new Turma_Model();
        let lista = await turma_M.listarSemGradeCurricular();
        let lista_Turma = [];
        lista.forEach(e=>{
            lista_Turma.push({
                id: e.id,
                turma: `${e.turma} - ${e.serie} - ${e.ano_letivo}`
            });
        });

        let disciplina_M = new Disciplina_Model();
        let lista_Disciplina = await disciplina_M.listar();
        resp.render("grade_curricular/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_curricular_para_alterar,
            lista_Turma,
            lista_Disciplina
        });
    }

    // async cadastrar_ano_letivo(req, resp) {
    //     if(req.body.ano_letivo == ""){
    //         resp.send({
    //             ok : false,
    //             msg: "Campo incompleto"
    //         })
    //         return;
    //     }

    //     let ano_letivo_M = new Ano_Letivo_Model();
    //     ano_letivo_M.ano_letivo = req.body.ano_letivo;

    //     let lista_ano_letivo = [];

    //     lista_ano_letivo = await ano_letivo_M.inserir();
    //     if(lista_ano_letivo){
    //         resp.send({
    //             ok : true,
    //             msg: "Ano Letivo cadastrado com sucesso"
    //         })
    //     } else{            
    //         resp.send({
    //             ok : false,
    //             msg: "Erro ao inserir o Ano Letivo"
    //         })
    //     }
    // }
    
    // async excluir_ano_letivo(req, resp){
    //     let ano_letivo_M = new Ano_Letivo_Model();
    //     ano_letivo_M.id = req.body.id;

    //     let lista_ano_letivo = await ano_letivo_M.excluir();
    //     if(lista_ano_letivo){
    //         resp.send({
    //             ok : true
    //         })
    //     } else{            
    //         resp.send({
    //             ok : false
    //         })
    //     }
    // }

    // async listar_editar(req, resp){
    //     const id = req.params.id;
    //     let ano_letivo_M = new Ano_Letivo_Model();
    //     let ano_letivo_para_alterar = await ano_letivo_M.obter(id);
    //     ano_letivo_para_alterar = ano_letivo_para_alterar[0];

    //     resp.render("ano_letivo/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", ano_letivo_para_alterar});
    // }

    // async editar_ano_letivo(req, resp) {
    //     if(req.body.ano_letivo == ""){
    //         resp.send({
    //             ok : false,
    //             msg: "Campo incompleto"
    //         })
    //         return;
    //     }

    //     let ano_letivo_M = new Ano_Letivo_Model();
    //     ano_letivo_M.id =  req.body.id;
    //     ano_letivo_M.ano_letivo = req.body.ano_letivo;

    //     let lista_ano_letivo = [];

    //     lista_ano_letivo = await ano_letivo_M.atualizar();
    //     if(lista_ano_letivo){
    //         resp.send({
    //             ok : true,
    //             msg: "Ano Letivo Editado com sucesso"
    //         })
    //     } else{            
    //         resp.send({
    //             ok : false,
    //             msg: "Erro ao editar o Ano Letivo"
    //         })
    //     }
    // }
}

module.exports = Grade_Curricular_Controller;