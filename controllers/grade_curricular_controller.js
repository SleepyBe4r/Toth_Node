const Disciplina_Model = require("../models/disciplina_model");
const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Grade_Curricular_Model = require("../models/grade_curricular_model");
const Turma_Model = require("../models/turma_model");

class Grade_Curricular_Controller{

    async listar_view(req, resp){
        let grade_curricular_M = new Grade_Curricular_Model();
        let lista_grades = await grade_curricular_M.listar();
        resp.render("grade_curricular/listar_grade_curricular.ejs", { layout: "layout_admin_home.ejs", lista_grades});
    }

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

        let professor_M = new Professor_Model();
        let lista_Prof = await professor_M.listar();

        let pessoa_M = new Pessoa_Model();
        let lista_Pessoa = await pessoa_M.listar();

        let lista_Professor = [];
        lista_Prof.forEach(e=>{
            for (let i = 0; i < lista_Pessoa.length; i++) {
                if(e.cpf == lista_Pessoa[i].cpf){
                    lista_Professor.push({
                        cpf: e.cpf,
                        nome: lista_Pessoa[i].nome
                    });
                }
            }
        });

        resp.render("grade_curricular/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_curricular_para_alterar,
            lista_Turma,
            lista_Disciplina,
            lista_Professor
        });
    }

    async cadastrar_grade_curricular(req, resp) {
        if(req.body.turma == "" && req.body.grade_curricular.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }
        let grade_curricular = req.body.grade_curricular;
        let lista_grade_curricular = [];

        for (let i = 0; i < grade_curricular.length; i++) {
            let grade_curricular_M = new Grade_Curricular_Model();
            grade_curricular_M.id_turma = req.body.turma;
            grade_curricular_M.id_disciplina = grade_curricular[i].disciplina;
            grade_curricular_M.cpf_professor = grade_curricular[i].professor;            
            let resultado = await grade_curricular_M.inserir(); 
            lista_grade_curricular.push(resultado);
        }

        if(lista_grade_curricular.length == grade_curricular.length){
            resp.send({
                ok : true,
                msg: "Grade Curricular cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir a Grade Curricular"
            })
        }
    }
    
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