const Atividade_Model = require("../models/atividade_model");
const Disciplina_Model = require("../models/disciplina_model");
const Matricula_Model = require("../models/matricula_model");

class Atividade_Controller{
  
    async listar_view_professor(req, resp){
        let atividade_M = new Atividade_Model();
        atividade_M.cpf_professor = req.cookies.usuario_Logado;
        let lista_atividades = await atividade_M.listarPorProf();
        resp.render("atividade/listar_atividade_P.ejs", { layout: "layout_admin_home.ejs", lista_atividades});
    }

    async listar_view_aluno(req, resp){
        let atividade_M = new Atividade_Model();
        let matricula_M = new Matricula_Model();
        matricula_M.cpf_aluno = req.cookies.usuario_Logado;
        let lista_matricula = await matricula_M.obterPorAluno();

        atividade_M.id_matricula = lista_matricula[0].id;
        let lista_atividades = await atividade_M.listarPorAluno();
        resp.render("atividade/listar_atividade_A.ejs", { layout: "layout_aluno_home.ejs", lista_atividades});
    }

    async listar_ver_mais_A(req, resp){
        const id = req.params.id;
        let atividade_M = new Atividade_Model();

        atividade_M.id = id;
        let lista_atividades = await atividade_M.obter();
        resp.render("atividade/listar_ver_mais_A.ejs", { layout: "layout_aluno_home.ejs", lista_atividades});
    }

    async responder_atividade(req, resp){
        let id_atividade = req.body.id_atividade;
        let id_matricula = req.body.id_matricula;
        let resposta = req.body.resposta;
        let status = req.body.status;

        let atividade_M = new Atividade_Model();
        atividade_M.id = id_atividade;
        atividade_M.id_matricula = id_matricula;
        atividade_M.txt_atividade_resposta = resposta;
        atividade_M.status = status;

        let lista_atividade = await atividade_M.responder();
        if(lista_atividade){
            resp.send({
                ok : true,
                msg: "Atividade respondida com sucesso"
            })
        } else{
            resp.send({
                ok : false,
                msg: "Erro ao responder a Atividade"
            })
        }
    }

    async listar_cadastro(req, resp){
        let cpf_professor = req.cookies.usuario_Logado;
        let disciplina_M = new Disciplina_Model();
        let lista_Disciplina = await disciplina_M.obter_Disc_Prof(cpf_professor); 
        let atividade_para_alterar = undefined;
        resp.render("atividade/cadastrar_view.ejs",{ layout: "layout_professor_home.ejs", lista_Disciplina, atividade_para_alterar});
    }

    async cadastrar_atividade(req, resp){
        let cpf_professor = req.cookies.usuario_Logado;
        let disciplina = req.body.disciplina;
        let turma = req.body.turma;
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let nota = req.body.nota;
        let peso = req.body.peso;
        let dt_inicial = req.body.dt_inicial;
        let dt_final = req.body.dt_final;
        let status = req.body.status;
        let lista_atividade = [];

        if(cpf_professor == ""){
            resp.send({
                ok : false,
                msg: "Professor não esta logado"
            })
            return;
        }

        if(disciplina == "" || turma == "" || nome == "" ||
            descricao == "" || nota == "" || peso == "" ||
            dt_inicial == "" || dt_final == "" || status == ""){
            resp.send({
                ok : false,
                msg: "campo invalido"
            })
            return;
        }
        let matricula_M = new Matricula_Model();
        let lista_matricula = await matricula_M.listarPorTurma(turma);

        lista_matricula.forEach(async e=>{
            let atividade_M = new Atividade_Model();
            atividade_M.cpf_professor = cpf_professor;
            atividade_M.id_disciplina = disciplina;
            atividade_M.id_matricula = e.id;
            atividade_M.nome = nome;
            atividade_M.descricao = descricao;
            atividade_M.nota = nota;
            atividade_M.peso = peso;
            atividade_M.dt_inicio = dt_inicial;
            atividade_M.dt_final = dt_final;
            atividade_M.status = status;

            lista_atividade.push( await atividade_M.inserir());
        });

        if(lista_matricula.length == lista_atividade.length){
            resp.send({
                ok : true,
                msg: "Atividade enviada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao envir a Atividade"
            })
        }
        
    }
}

module.exports = Atividade_Controller;