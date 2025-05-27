const Disciplina_Model = require("../models/disciplina_model");
const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Grade_Model = require("../models/grade_model");
const Turma_Model = require("../models/turma_model");
const Serie_Model = require("../models/serie_model");
const Ano_Letivo_Model = require("../models/ano_letivo_model");
const Sala_Model = require("../models/sala_model");
const Item_Grade_Model = require("../models/item_grade_model");
const Horario_Model = require("../models/horario_model");
const Disciplina_grade_Model = require("../models/disciplina_grade_model");
const Professor_Grade_Model = require("../models/professor_grade_model");

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

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let sala_M = new Sala_Model();
        let lista_salas = await sala_M.listar();

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
            lista_professores,
            lista_series,
            lista_anos,
            lista_salas
        });
    }

    async cadastrar_grade(req, resp) {

        if( req.body.ano == "" &&
            req.body.serie == "" && 
            req.body.turma == "" &&
            req.body.sala == "" &&
            req.body.grade.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let grade = req.body.grade;
        let lista_grade = [];
        let grade_M = new Grade_Model();
        
        grade_M.id_ano_letivo = req.body.ano;
        grade_M.id_series = req.body.serie;
        grade_M.id_turma = req.body.turma;
        grade_M.id_salas = req.body.sala;
        
        let resultado_grade = await grade_M.inserir();
        let ultimo_id_grade = await grade_M.selecionar_ultimo_id();

        if (resultado_grade) {
            for (let i = 0; i < grade.length; i++) {
                let disciplina_M = new Disciplina_Model()
                let achou_disciplina = await disciplina_M.obter(grade[i].disciplina);
                if(achou_disciplina){
                    let item_grade_M = new Item_Grade_Model();
                    item_grade_M.id_grade = ultimo_id_grade;                
    
                    let resultado_item = await item_grade_M.inserir(); 
                    let ultimo_id_item = await item_grade_M.selecionar_ultimo_id(); 
    
                    let horario_M = new Horario_Model();
    
                    horario_M.id_grade = ultimo_id_grade;
                    horario_M.id_item = ultimo_id_item;
                    horario_M.dia_semana = grade[i].dia;
                    horario_M.horario_inicio = grade[i].horario_inicio;
                    horario_M.horario_fim = grade[i].horario_fim;
                    horario_M.periodo = grade[i].periodo;
    
                    let resultado_horario = await horario_M.inserir();
                    
                    let disc_grade_M = new Disciplina_grade_Model();
    
                    disc_grade_M.id_grade = ultimo_id_grade;
                    disc_grade_M.id_item = ultimo_id_item;
                    disc_grade_M.id_disciplina = grade[i].disciplina;
    
                    let resultado_disc_grade = await disc_grade_M.inserir();
    
                    let prof_grade_M = new Professor_Grade_Model();
    
                    prof_grade_M.id_grade = ultimo_id_grade;
                    prof_grade_M.id_item = ultimo_id_item;
                    prof_grade_M.cpf_professor = grade[i].professor;
    
                    let resultado_prof_grade = await prof_grade_M.inserir();
    
                    if (resultado_item && resultado_horario && resultado_disc_grade && resultado_prof_grade) {
                        lista_grade.push(resultado_item);                    
                    }
                }
            }
        }

        if(lista_grade.length == grade.length){
            resp.send({
                ok : true,
                msg: "Grade cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir a Grade"
            })
        }
    }

    async editar_view(req, resp){
        const id = req.params.id;
        let grade_M = new Grade_Model();
        let grade_para_alterar  = await grade_M.obter(id);
        let turma_M = new Turma_Model();
        let lista = await turma_M.obter(grade_para_alterar.id_turma);
        let lista_turmas = [];
        lista.forEach(e=>{
            lista_turmas.push(e);
        });
        
        lista = await turma_M.listar_sem_grade();        
        lista.forEach(e=>{
            lista_turmas.push(e);
        });
 
        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let sala_M = new Sala_Model();
        let lista_salas = await sala_M.listar();

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

        let item_grade_M = new Item_Grade_Model();
        item_grade_M.id_grade = id;                

        let lista_item = await item_grade_M.listar_por_grade(); 
        let lista_item_grade = [];

        for (const item of lista_item) {
            let horario_M = new Horario_Model();
            let lista_horario = await horario_M.obter(item.id_item, id);

            let disc_grade_M = new Disciplina_grade_Model();
            let lista_disc_grade = await disc_grade_M.obter(item.id_item, id);

            let disciplina_M = new Disciplina_Model();
            let lista_disciplina = await disciplina_M.obter(lista_disc_grade[0].id_disciplina);

            let prof_grade_M = new Professor_Grade_Model();
            let lista_prof_grade = await prof_grade_M.obter(item.id_item, id);

            lista_item_grade.push({
                id_item: item.id_item,
                id_disciplina: lista_disc_grade[0].id_disciplina,
                disciplina: lista_disciplina[0].nome,
                dia_semana: lista_horario[0].dia_semana,
                horario_inicio: lista_horario[0].horario_inicio,
                horario_fim: lista_horario[0].horario_fim,
                periodo: lista_horario[0].periodo,
                cpf_professor: lista_prof_grade[0].cpf_professor,
                professor: lista_professores.find(e=> e.cpf == lista_prof_grade[0].cpf_professor).nome
            });
        }

        resp.render("grade/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            grade_para_alterar, // ok
            lista_turmas, // ok
            lista_disciplinas, // ok
            lista_professores, // ok
            lista_series, // ok
            lista_anos, // ok
            lista_salas, // ok
            lista_item_grade, // ok
        });
    }
    
    async editar_grade(req, resp) {
        if( req.body.id_grade == "" &&
            req.body.ano == "" &&
            req.body.serie == "" && 
            req.body.turma == "" &&
            req.body.sala == "" &&
            req.body.grade.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let id_grade = req.body.id_grade;
        let grade = req.body.grade;
        let lista_grade = [];
        let grade_M = new Grade_Model();
        
        grade_M.id = id_grade;
        grade_M.id_ano_letivo = req.body.ano;
        grade_M.id_series = req.body.serie;
        grade_M.id_turma = req.body.turma;
        grade_M.id_salas = req.body.sala;        
        
        let resultado_grade = await grade_M.atualizar();

        let item_grade_M = new Item_Grade_Model();

        item_grade_M.id_grade = id_grade;
        let item_grade_old = await item_grade_M.listar_por_grade(id_grade);

        if (resultado_grade) {
            for (let i = 0; i < grade.length; i++) {
                let achou = false;
                item_grade_old.forEach((g_old, index) => {
                    if (g_old.id_item == grade[i].id_item) {
                        achou = true;
                        item_grade_old.splice(index, 1); 
                    }
                });
    
                if (!achou) {
                    let disciplina_M = new Disciplina_Model()
                    let achou_disciplina = await disciplina_M.obter(grade[i].disciplina);
                    if(achou_disciplina){
                        let item_grade_M = new Item_Grade_Model();
                        item_grade_M.id_grade = id_grade;                

                        let resultado_item = await item_grade_M.inserir(); 
                        let ultimo_id_item = await item_grade_M.selecionar_ultimo_id(); 

                        let horario_M = new Horario_Model();

                        horario_M.id_grade = id_grade;
                        horario_M.id_item = ultimo_id_item;
                        horario_M.dia_semana = grade[i].dia;
                        horario_M.horario_inicio = grade[i].horario_inicio;
                        horario_M.horario_fim = grade[i].horario_fim;
                        horario_M.periodo = grade[i].periodo;

                        let resultado_horario = await horario_M.inserir();
                        
                        let disc_grade_M = new Disciplina_grade_Model();

                        disc_grade_M.id_grade = id_grade;
                        disc_grade_M.id_item = ultimo_id_item;
                        disc_grade_M.id_disciplina = grade[i].disciplina;

                        let resultado_disc_grade = await disc_grade_M.inserir();

                        let prof_grade_M = new Professor_Grade_Model();

                        prof_grade_M.id_grade = id_grade;
                        prof_grade_M.id_item = ultimo_id_item;
                        prof_grade_M.cpf_professor = grade[i].professor;

                        let resultado_prof_grade = await prof_grade_M.inserir();

                        if (resultado_item && resultado_horario && resultado_disc_grade && resultado_prof_grade) {
                            lista_grade.push(resultado_item);                    
                        }
                    }
                } else {                 
                    let horario_M = new Horario_Model();
    
                    horario_M.id_grade = id_grade;
                    horario_M.id_item = grade[i].id_item;
                    horario_M.dia_semana = grade[i].dia;
                    horario_M.horario_inicio = grade[i].horario_inicio;
                    horario_M.horario_fim = grade[i].horario_fim;
                    horario_M.periodo = grade[i].periodo;
    
                    let resultado_horario = await horario_M.atualizar();
                    
                    let disc_grade_M = new Disciplina_grade_Model();
    
                    disc_grade_M.id_grade = id_grade;
                    disc_grade_M.id_item = grade[i].id_item;
                    disc_grade_M.id_disciplina = grade[i].disciplina;
    
                    let resultado_disc_grade = await disc_grade_M.atualizar();
    
                    let prof_grade_M = new Professor_Grade_Model();
    
                    prof_grade_M.id_grade = id_grade;
                    prof_grade_M.id_item = grade[i].id_item;
                    prof_grade_M.cpf_professor = grade[i].professor;
    
                    let resultado_prof_grade = await prof_grade_M.atualizar();
                    
                    if (resultado_horario || resultado_disc_grade || resultado_prof_grade) {
                        lista_grade.push(resultado_horario);                    
                    }
                }
            }
        }

        item_grade_old.forEach(async (g_old, index) => {
            let grade_exclusao_M = new Grade_Model();
            grade_exclusao_M.id = req.body.id_grade;
            grade_exclusao_M.id_item = g_old.id_item;
                    
            if(await grade_exclusao_M.excluir()) grade_old.splice(index, 1);  
        });

        if(lista_grade.length == grade.length){
            resp.send({
                ok : true,
                msg: "Grade editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Grade"
            })
        }
    }
    
    async excluir_grade(req, resp){
        let grade_M = new Grade_Model();
        grade_M.id = req.body.id;

        let lista_grade = await grade_M.excluir();
        if(lista_grade){
            resp.send({
                ok : true
            })
        } else{            
            resp.send({
                ok : false
            })
        }
    }
}

module.exports = Grade_Controller;