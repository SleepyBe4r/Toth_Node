const Ano_Letivo_Model = require("../models/ano_letivo_model");
const Atividade_Model = require("../models/atividade_model");
const Disciplina_Model = require("../models/disciplina_model");
const Matricula_Model = require("../models/matricula_model");
const Notas_Model = require("../models/notas_model");
const Quadro_Notas_Model = require("../models/quadro_notas_model");
const Serie_Model = require("../models/serie_model");
const Turma_Model = require("../models/turma_model");

class Quadro_Notas_Controller{

    async listar_view(req, resp){
        let quadro_notas_M = new Quadro_Notas_Model();
        let lista_quadro_notas = await quadro_notas_M.listar();
        resp.render("quadro_notas/listar_quadro_notas.ejs", { layout: "layout_professor_home.ejs", lista_quadro_notas});
    }

    async listar_cadastro(req, resp){
        let quadro_notas_para_alterar  = undefined;

        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let atividade_M = new Atividade_Model();
        let lista_atividades = await atividade_M.listar_sem_quadro();

        resp.render("quadro_notas/cadastrar_view.ejs", { 
            layout: "layout_professor_home.ejs", 
            quadro_notas_para_alterar,
            lista_turmas,
            lista_series,
            lista_anos,
            lista_disciplinas,
            lista_atividades});
    }

    async cadastrar_quadro_notas(req, resp) {

        if(req.body.id_ano_letivo == "" || req.body.id_serie == "" || req.body.id_turma == "" || 
            req.body.bimestre == "" || req.body.id_disciplina == "" || req.body.atividades.length == 0){ 
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let id_ano_letivo = parseInt(req.body.id_ano_letivo);
        let id_serie = parseInt(req.body.id_serie);
        let id_turma = parseInt(req.body.id_turma);
        let bimestre = parseInt(req.body.bimestre);
        let id_disciplina = parseInt(req.body.id_disciplina);
        let atividades = req.body.atividades;
        let cpf_professor = req.cookies.usuario_logado;

        let quadro_notas_M = new Quadro_Notas_Model();
        quadro_notas_M.id_ano_letivo = id_ano_letivo;
        quadro_notas_M.id_series = id_serie;
        quadro_notas_M.id_turma = id_turma;
        quadro_notas_M.bimestre = bimestre;
        quadro_notas_M.id_disciplina = id_disciplina;     
        quadro_notas_M.cpf_professor = cpf_professor;

        let resultado_quadro = await quadro_notas_M.inserir();
        let ultimo_id_quadro = await quadro_notas_M.obter_ultimo_id();
        
        let resposta_atividade = [];
        let resposta_nota = [];

        if(resultado_quadro){
            let atividade_M = new Atividade_Model();
            for(let i = 0; i < atividades.length; i++){
                let atividade = await atividade_M.obter(atividades[i].id_atividade);
                if(atividade.length > 0){
                    atividade_M.id_atividades = atividade[0].id_atividades;
                    atividade_M.nome = atividade[0].nome;
                    atividade_M.descricao = atividade[0].descricao;
                    atividade_M.dt_inicio = atividade[0].dt_inicio;
                    atividade_M.dt_final = atividade[0].dt_final;
                    atividade_M.id_quadro = ultimo_id_quadro;
                    await atividade_M.atualizar() == true ? resposta_atividade.push(true) : '';
                }
            }

            let matricula_M = new Matricula_Model();
            matricula_M.id_ano_letivo = id_ano_letivo;
            matricula_M.id_series = id_serie;
            matricula_M.id_turma = id_turma;

            let lista_matriculas = await matricula_M.listar_por_turma();
            for(let i = 0; i < lista_matriculas.length; i++){
                let matricula = lista_matriculas[i];
                for(let j = 0; j < atividades.length; j++){
                    let atividade = atividades[j];
                    let quadro_notas_atividade_M = new Notas_Model();
                    quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                    quadro_notas_atividade_M.id_atividade = atividade.id_atividade;
                    quadro_notas_atividade_M.id_quadro = ultimo_id_quadro;
                    quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                    quadro_notas_atividade_M.peso = atividade.peso;


                    let atividade_DB = await atividade_M.obter(atividades[i].id_atividade);

                    let hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);

                    let dt_inicio = new Date(atividade_DB[0].dt_inicio);
                    let dt_final = new Date(atividade_DB[0].dt_final);

                    const dataInicio = new Date(dt_inicio.getFullYear(), dt_inicio.getMonth(), dt_inicio.getDate());
                    const dataFim = new Date(dt_final.getFullYear(), dt_final.getMonth(), dt_final.getDate());

                    if (hoje < dataInicio || hoje > dataFim) {
                        quadro_notas_atividade_M.status = "fechada";
                    } else {
                        quadro_notas_atividade_M.status = "aberto";
                    }

                    await quadro_notas_atividade_M.inserir() == true ? resposta_nota.push(true) : '';
                }
            }

        }
        
        if(atividades.length == resposta_atividade.length && resposta_nota.length > 0){
            resp.send({
                ok : true,
                msg: "Quadro de Notas cadastrado com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir o Quadro de Notas"
            })
        }
    }
    
    async excluir_quadro_notas(req, resp){
        let ano_letivo_M = new Ano_Letivo_Model();
        ano_letivo_M.id = req.body.id;

        let lista_ano_letivo = await ano_letivo_M.excluir();
        if(lista_ano_letivo){
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
        let ano_letivo_M = new Ano_Letivo_Model();
        let ano_letivo_para_alterar = await ano_letivo_M.obter(id);
        ano_letivo_para_alterar = ano_letivo_para_alterar[0];

        resp.render("ano_letivo/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", ano_letivo_para_alterar});
    }

    async editar_quadro_notas(req, resp) {
        if(req.body.ano_letivo == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let ano_letivo_M = new Ano_Letivo_Model();
        ano_letivo_M.id =  req.body.id;
        ano_letivo_M.ano_letivo = req.body.ano_letivo;

        let lista_ano_letivo = [];

        lista_ano_letivo = await ano_letivo_M.atualizar();
        if(lista_ano_letivo){
            resp.send({
                ok : true,
                msg: "Ano Letivo Editado com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar o Ano Letivo"
            })
        }
    }
}

module.exports = Quadro_Notas_Controller;