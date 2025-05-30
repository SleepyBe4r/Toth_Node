const Ano_Letivo_Model = require("../models/ano_letivo_model");
const Atividade_Model = require("../models/atividade_model");
const Disciplina_Model = require("../models/disciplina_model");
const Matricula_Model = require("../models/matricula_model");
const Notas_Model = require("../models/notas_model");
const Quadro_Notas_Model = require("../models/quadro_notas_model");
const Serie_Model = require("../models/serie_model");
const Turma_Model = require("../models/turma_model");

class Atividade_Controller{
  
    async listar_view_professor(req, resp){
        let atividade_M = new Atividade_Model();
        let lista_atividades = await atividade_M.listar();
        resp.render("atividade/listar_atividade_P.ejs", { layout: "layout_professor_home.ejs", lista_atividades});
    }

    async listar_view_aluno(req, resp){
        let atividade_M = new Atividade_Model();
        let notas_M = new Notas_Model();
        let matricula_M = new Matricula_Model();
        let lista_matricula = await matricula_M.obter_por_aluno(req.cookies.usuario_logado);

        notas_M.id_matricula = lista_matricula[0].id_matricula;
        let lista_notas = await notas_M.listar_por_matricula();
        let lista_atividades = []
        for(let i = 0; i < lista_notas.length; i++){
            let atividade = await atividade_M.obter(lista_notas[i].id_atividade);
            
            let quadro_notas_M = new Quadro_Notas_Model();
            let quadro_notas = await quadro_notas_M.obter(atividade[0].id_quadro);

            let disciplina_M = new Disciplina_Model();
            let disciplinas = await disciplina_M.obter(quadro_notas[0].id_disciplina);

            if(lista_notas[i].status != "fechada"){
                lista_atividades.push({
                    id_nota: lista_notas[i].id_nota,
                    nome: atividade[0].nome,
                    dt_inicio: atividade[0].dt_inicio,
                    dt_final: atividade[0].dt_final,
                    disciplina: disciplinas[0].nome
                });
            }
        }
        resp.render("atividade/listar_atividade_A.ejs", { layout: "layout_aluno_home.ejs", lista_atividades});
    }

    async listar_ver_mais_A(req, resp){ 
        
        let atividade_M = new Atividade_Model();
        let notas_M = new Notas_Model();
        const id = req.params.id;
        
        let lista_notas = await notas_M.obter(id);    
        let lista_atividades = await atividade_M.obter(lista_notas[0].id_atividade);
        
        let atividade = {
            id_nota: lista_notas[0].id_nota,
            nome: lista_atividades[0].nome,
            descricao: lista_atividades[0].descricao,
            dt_inicio: lista_atividades[0].dt_inicio,
            dt_final: lista_atividades[0].dt_final,
            peso: lista_notas[0].peso,
            nota: lista_notas[0].nota,
            feedback: lista_notas[0].feedback,
            atividade_resposta: lista_notas[0].atividade_resposta,
            status: lista_notas[0].status
        };
        
        
        resp.render("atividade/ver_mais_A.ejs", { layout: "layout_aluno_home.ejs", atividade});
    }

    async responder_atividade(req, resp){
        if( req.body.id_atividade != "" || req.file != null ||
            req.body.resposta_extencao != ""){
            
            let notas_M = new Notas_Model();
            let lista_notas = await notas_M.obter(req.body.id_atividade);

            notas_M.id_nota = lista_notas[0].id_nota;
            notas_M.id_atividade = req.body.id_atividade;
            notas_M.peso = lista_notas[0].peso;
            notas_M.nota = lista_notas[0].nota;
            notas_M.feedback = lista_notas[0].feedback;
            notas_M.atividade_resposta = req.file.buffer;
            notas_M.atividade_resposta_extencao = req.body.resposta_extencao;
            notas_M.status = "respondida";
            notas_M.id_matricula = lista_notas[0].id_matricula;
            notas_M.id_quadro = lista_notas[0].id_quadro;

            let resposta = await notas_M.atualizar();

            if(resposta){
                resp.send({
                    ok : true,
                    msg: "Atividade respondida com sucesso"
                })
                return;
            } else{
                resp.send({
                    ok : false,
                    msg: "Erro ao responder a Atividade"
                })
                return;
            }
        } else{
            resp.send({
                ok : false,
                msg: "Erro ao responder a Atividade"
            })
        }
        let id_atividades = req.body.id_atividades;
        let id_matricula = req.body.id_matricula;
        let resposta = req.body.resposta;
        let status = req.body.status;

        let atividade_M = new Atividade_Model();
        atividade_M.id = id_atividades;
        atividade_M.id_matricula = id_matricula;
        atividade_M.txt_atividade_resposta = resposta;
        atividade_M.status = status;

        let lista_atividade = await atividade_M.responder();
        if(lista_atividade){
            
        } else{
            
        }
    }

    async listar_cadastro(req, resp){
        let atividade_para_alterar = undefined;

        resp.render("atividade/cadastrar_view.ejs",{ 
            layout: "layout_professor_home.ejs", 
            atividade_para_alterar});
    }

    async cadastrar_atividade(req, resp){
        if( req.body.nome == "" || req.body.descricao == "" || 
            req.body.dt_inicial == "" || req.body.dt_final == "" || req.body.dt_inicial > req.body.dt_final){
            resp.send({
                ok : false,
                msg: "campos invalidos"
            })
            return;
        }

        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let dt_inicial = req.body.dt_inicial;
        let dt_final = req.body.dt_final;

        let atividade_M = new Atividade_Model();
        atividade_M.nome = nome;
        atividade_M.descricao = descricao;
        atividade_M.dt_inicio = dt_inicial;
        atividade_M.dt_final = dt_final;

        let resposta_atividade = await atividade_M.inserir();

        if(resposta_atividade){
            resp.send({
                ok : true,
                msg: "Atividade cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao cadastrar a Atividade"
            })
        }
    }

    async listar_editar(req, resp){
        const id = req.params.id;
        let atividade_M = new Atividade_Model();
        let atividade_para_alterar = await atividade_M.obter(id);
        atividade_para_alterar = atividade_para_alterar[0];

        resp.render("atividade/cadastrar_view.ejs", { layout: "layout_professor_home.ejs", atividade_para_alterar});
    }

    async editar_atividade(req, resp){
        if( req.body.nome == "" || req.body.descricao == "" || 
            req.body.dt_inicial == "" || req.body.dt_final == "" || req.body.dt_inicial > req.body.dt_final){
            resp.send({
                ok : false,
                msg: "campos invalidos"
            })
            return;
        }

        let id_atividades = req.body.id;
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let dt_inicial = req.body.dt_inicial;
        let dt_final = req.body.dt_final;

        let atividade_M = new Atividade_Model();
        atividade_M.id_atividades = id_atividades;
        atividade_M.nome = nome;
        atividade_M.descricao = descricao;
        atividade_M.dt_inicio = dt_inicial;
        atividade_M.dt_final = dt_final;

        let resposta_atividade = await atividade_M.atualizar();

        if(resposta_atividade){
            resp.send({
                ok : true,
                msg: "Atividade editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Atividade"
            })
        }
    }

    async excluir_atividade(req, resp){
        let atividade_M = new Atividade_Model();
        atividade_M.id_atividades = req.body.id;

        let lista_atividade = await atividade_M.excluir();
        if(lista_atividade){
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

module.exports = Atividade_Controller;