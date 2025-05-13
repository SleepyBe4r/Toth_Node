const Disciplina_Model = require("../models/disciplina_model");
const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Grade_Curricular_Model = require("../models/grade_curricular_model");
const Turma_Model = require("../models/turma_model");

class Grade_Curricular_Controller{

    async listar_view(req, resp){
        let grade_curricular_M = new Grade_Curricular_Model();
        let lista_grades = await grade_curricular_M.listar_por_turma();

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let pessoa_M = new Pessoa_Model();
        let lista_pessoas = await pessoa_M.listar();

        let turma_M = new Turma_Model();
        let lista = await turma_M.listar();
        let lista_turmas = [];
        lista.forEach(e=>{
            lista_turmas.push({
                id: e.id,
                turma: `${e.turma} - ${e.serie} - ${e.ano_letivo}`
            });
        });
        
        let lista_completa = [];

        lista_grades.forEach(grade =>{
            let turma = lista_turmas.find(t => t.id === grade.id_turma).turma;
            let disciplina = lista_disciplinas.find(d => d.id === grade.id_disciplina).nome;
            let professor = lista_pessoas.find(p => p.cpf === grade.cpf_professor).nome;

            lista_completa.push({
                id_grade: grade.id,
                id_item: grade.id_item,
                id_turma: grade.id_turma,
                turma: turma,
                id_disciplina: grade.id_disciplina,
                disciplina: disciplina,
                cpf_professor: grade.cpf_professor,
                professor: professor
            })
        });

        resp.render("grade_curricular/listar_grade_curricular.ejs", { 
            layout: "layout_admin_home.ejs", 
            lista_grades: lista_completa});
    }

    async cadastro_view(req, resp){
        let grade_curricular_para_alterar  = undefined;
        let turma_M = new Turma_Model();
        let lista = await turma_M.listar_sem_grade_curricular();
        let lista_turmas = [];
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

        resp.render("grade_curricular/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_curricular_para_alterar,
            lista_turmas,
            lista_disciplinas,
            lista_professores
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
        let grade_curricular_M = new Grade_Curricular_Model();
        let ultimo_id = await grade_curricular_M.selecionar_ultimo_id();

        for (let i = 0; i < grade_curricular.length; i++) {
            let grade_curricular_M = new Grade_Curricular_Model();
            grade_curricular_M.id = ultimo_id + 1;
            grade_curricular_M.id_item = i + 1;
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

    async editar_view(req, resp){
        const id = req.params.id;
        let grade_curricular_M = new Grade_Curricular_Model();
        let grade_curricular_para_alterar  = await grade_curricular_M.obter(id);
        let turma_M = new Turma_Model();
        let lista = await turma_M.obter(grade_curricular_para_alterar[0].id_turma);
        let lista_turmas = [];
        lista.forEach(e=>{
            lista_turmas.push({
                id: e.id,
                turma: `${e.turma} - ${e.serie} - ${e.ano_letivo}`
            });
        });
        
        lista = await turma_M.listar_sem_grade_curricular();        
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

        resp.render("grade_curricular/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_curricular_para_alterar,
            lista_turmas,
            lista_disciplinas,
            lista_professores
        });
    }
    
    async editar_grade_curricular(req, resp) {
        if(req.body.turma == "" && req.body.grade_curricular.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }
        let grade_curricular = req.body.grade_curricular;
        let lista_grade_curricular = [];
        let grade_curricular_M = new Grade_Curricular_Model();
        let grade_old = await grade_curricular_M.obter(req.body.id_grade);

        for (let i = 0; i < grade_curricular.length; i++) {
            let grade_item_M = new Grade_Curricular_Model();
            let achou = false;
            let resultado;
            grade_old.forEach((g_old, index) => {
                if (g_old.id_item == grade_curricular[i].id_item) {
                    achou = true;
                    grade_old.splice(index, 1); 
                }
            });

            if (achou) {
                grade_item_M.id = req.body.id_grade;
                grade_item_M.id_item = grade_curricular[i].id_item;
                grade_item_M.id_turma = req.body.turma;
                grade_item_M.id_disciplina = grade_curricular[i].disciplina;
                grade_item_M.cpf_professor = grade_curricular[i].professor;            
                resultado = await grade_item_M.atualizar();
            } else {
                grade_item_M.id = req.body.id_grade;
                grade_item_M.id_item = grade_curricular[i].id_item;
                grade_item_M.id_turma = req.body.turma;
                grade_item_M.id_disciplina = grade_curricular[i].disciplina;
                grade_item_M.cpf_professor = grade_curricular[i].professor;            
                resultado = await grade_item_M.inserir();
            }
            lista_grade_curricular.push(resultado);
        }

        grade_old.forEach(async (g_old, index) => {
            let grade_exclusao_M = new Grade_Curricular_Model();
            grade_exclusao_M.id = req.body.id_grade;
            grade_exclusao_M.id_item = g_old.id_item;
                    
            if(await grade_exclusao_M.excluir()) grade_old.splice(index, 1);  
        });

        if(lista_grade_curricular.length == grade_curricular.length){
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

module.exports = Grade_Curricular_Controller;