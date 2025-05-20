const Disciplina_Model = require("../models/disciplina_model");
const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Grade_Model = require("../models/grade_model");
const Turma_Model = require("../models/turma_model");
const Serie_Model = require("../models/serie_model");
const Ano_Letivo_Model = require("../models/ano_letivo_model");

class Grade_Controller{

    async listar_view(req, resp){
        let grade_M = new Grade_Model();
        let lista_grades = await grade_M.listar();

        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();
        
        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        
        let lista_completa = [];

        lista_grades.forEach(grade =>{
            let turma = lista_turmas.find(t => t.id === grade.id_turma).turma;
            let serie = lista_series.find(s => s.id === grade.id_series).serie;
            let ano_letivo = lista_anos.find(a => a.id === grade.id_ano_letivo).ano_letivo;

            lista_completa.push({
                id_grade: grade.id,
                id_turma: grade.id_turma,
                turma: `${turma} - ${serie} - ${ano_letivo}`
            })
        });

        resp.render("grade/listar_grade.ejs", { 
            layout: "layout_admin_home.ejs", 
            lista_grades: lista_completa});
    }

    async cadastro_view(req, resp){
        let grade_para_alterar  = undefined;
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar_sem_grade();
         
        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let professor_M = new Professor_Model();
        let lista_profs = await professor_M.listar();

        let pessoa_M = new Pessoa_Model();
        let lista_pessoas = await pessoa_M.listar();

        let lista_professores = [];
        lista_profs.forEach(e=>{
            for (let i = 0; i < lista_pessoas.length; i++) {
                if(e.cpf == lista_pessoas[i].cpf){
                    lista_professores.push({
                        cpf: e.cpf,
                        nome: lista_pessoas[i].nome
                    });
                }
            }
        });

        resp.render("grade/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_para_alterar,
            lista_turmas,
            lista_disciplinas,
            lista_professores,
            lista_series,
            lista_anos
        });
    }

    async cadastrar_grade(req, resp) {
        if(req.body.turma == "" && req.body.grade.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }
        let grade = req.body.grade;
        let lista_grade = [];
        let grade_M = new Grade_Model();
        let ultimo_id = await grade_M.selecionar_ultimo_id();

        for (let i = 0; i < grade.length; i++) {
            let grade_M = new Grade_Model();
            grade_M.id = ultimo_id + 1;
            grade_M.id_item = i + 1;
            grade_M.id_turma = req.body.turma;
            grade_M.id_disciplina = grade[i].disciplina;
            grade_M.cpf_professor = grade[i].professor;            
            let resultado = await grade_M.inserir(); 
            lista_grade.push(resultado);
        }

        if(lista_grade.length == grade.length){
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

    async editar_view(req, resp){
        const id = req.params.id;
        let grade_M = new Grade_Model();
        let grade_para_alterar  = await grade_M.obter(id);
        let turma_M = new Turma_Model();
        let lista = await turma_M.obter(grade_para_alterar[0].id_turma);
        let lista_turmas = [];
        lista.forEach(e=>{
            lista_turmas.push({
                id: e.id,
                turma: `${e.turma} - ${e.serie} - ${e.ano_letivo}`
            });
        });
        
        lista = await turma_M.listar_sem_grade();        
        lista.forEach(e=>{
            lista_turmas.push({
                id: e.id,
                turma: `${e.turma} - ${e.serie} - ${e.ano_letivo}`
            });
        });

        
        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let professor_M = new Professor_Model();
        let lista_profs = await professor_M.listar();

        let pessoa_M = new Pessoa_Model();
        let lista_pessoas = await pessoa_M.listar();

        let lista_professores = [];
        lista_profs.forEach(e=>{
            for (let i = 0; i < lista_pessoas.length; i++) {
                if(e.cpf == lista_pessoas[i].cpf){
                    lista_professores.push({
                        cpf: e.cpf,
                        nome: lista_pessoas[i].nome
                    });
                }
            }
        });

        resp.render("grade/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_para_alterar,
            lista_turmas,
            lista_disciplinas,
            lista_professores
        });
    }
    
    async editar_grade(req, resp) {
        if(req.body.turma == "" && req.body.grade.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }
        let grade = req.body.grade;
        let lista_grade = [];
        let grade_M = new Grade_Model();
        let grade_old = await grade_M.obter(req.body.id_grade);

        for (let i = 0; i < grade.length; i++) {
            let grade_item_M = new Grade_Model();
            let achou = false;
            let resultado;
            grade_old.forEach((g_old, index) => {
                if (g_old.id_item == grade[i].id_item) {
                    achou = true;
                    grade_old.splice(index, 1); 
                }
            });

            if (achou) {
                grade_item_M.id = req.body.id_grade;
                grade_item_M.id_item = grade[i].id_item;
                grade_item_M.id_turma = req.body.turma;
                grade_item_M.id_disciplina = grade[i].disciplina;
                grade_item_M.cpf_professor = grade[i].professor;            
                resultado = await grade_item_M.atualizar();
            } else {
                grade_item_M.id = req.body.id_grade;
                grade_item_M.id_item = grade[i].id_item;
                grade_item_M.id_turma = req.body.turma;
                grade_item_M.id_disciplina = grade[i].disciplina;
                grade_item_M.cpf_professor = grade[i].professor;            
                resultado = await grade_item_M.inserir();
            }
            lista_grade.push(resultado);
        }

        grade_old.forEach(async (g_old, index) => {
            let grade_exclusao_M = new Grade_Model();
            grade_exclusao_M.id = req.body.id_grade;
            grade_exclusao_M.id_item = g_old.id_item;
                    
            if(await grade_exclusao_M.excluir()) grade_old.splice(index, 1);  
        });

        if(lista_grade.length == grade.length){
            resp.send({
                ok : true,
                msg: "Grade Curricular editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Grade Curricular"
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

module.exports = Grade_Controller;