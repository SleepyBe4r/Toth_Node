const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");

class Professor_Controller {

    async home_view(req, resp){
        resp.render("professor/professor_home_view.ejs", { layout: "layout_professor_home.ejs"});
    }

    async listar_view(req, resp) { // ta completamente errado;
        let professor = new Professor_Model();
        let listaProfessores = await professor.listar(); 
        
        resp.render("professor/professor_home_view.ejs", { 
            layout: "layout_professor_home.ejs",
            professores: listaProfessores 
        });
    }

    listar_cadastroProf(req, resp) {
        resp.render("professor/professor_cadastro_view.ejs", { layout: "layout_professor_home.ejs" });
    }

    async cadastrar_Prof(req, resp) {
        let professor = new Professor_Model();
        let pessoa = new Pessoa_Model();

        pessoa.cpf = req.body.cpf;
        pessoa.nome = req.body.nome;
        pessoa.data = req.body.dt_nascimento;
        pessoa.rua = req.body.rua;
        pessoa.bairro = req.body.bairro;
        pessoa.email = req.body.email;
        pessoa.fone = req.body.telefone;

        professor.cpf = req.body.cpf;
        professor.titulacao = req.body.titulacao;
        professor.dataAdmissao = req.body.dt_admissao;

        let resultadopessoa = await pessoa.inserir();
        if(resultadopessoa) {
            let resultado = await professor.inserir();
                if(resultado) {
            resp.send({ ok: true, msg: "Professor cadastrado com sucesso!" });
                } else {
            resp.send({ ok: false, msg: "Erro ao cadastrar professor" });
        }
        } else {
            resp.send({ ok: false, msg: "Erro ao cadastrar Pessoa" });
        }
    }

    async excluir_Prof(req, resp) {
        let cpf = req.body.cpf;
        let professor = new Professor_Model();
        professor.cpf = cpf;

        let resultado = await professor.excluir();
        if(resultado) {
            resp.send({ ok: true, msg: "Professor excluído com sucesso!" });
        } else {
            resp.send({ ok: false, msg: "Erro ao excluir professor" });
        }
    }

    async listar_editar(req, resp) {
        let cpf = req.params.cpf;
        let professor = new Professor_Model();
        professor.cpf = cpf;

        let dados = await professor.atualizar();
        resp.render("professor/professor_editar_view.ejs", { 
            layout: "layout_professor_cadastro.ejs",
            professor: dados 
        });
    }

    async editar_Prof(req, resp) {
        let professor = new Professor_Model();
        
        professor.cpf = req.body.cpf;
        professor.nome = req.body.nome;
        professor.email = req.body.email;
        professor.senha = req.body.senha;
        professor.titulacao = req.body.titulacao;
        professor.dataAdmissao = req.body.dt_admissao;

        let resultado = await professor.atualizar();
        if(resultado) {
            resp.send({ ok: true, msg: "Professor atualizado com sucesso!" });
        } else {
            resp.send({ ok: false, msg: "Erro ao atualizar professor" });
        }
    }
}

module.exports = Professor_Controller;