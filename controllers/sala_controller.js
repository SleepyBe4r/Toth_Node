const Professor_Model = require("../models/professor_model");
const Turma_Model = require("../models/turma_model");
const Serie_Controller = require("./serie_controller");
const Sala_Model = require("../models/sala_model");

class Sala_Controller {
    async listar_view(req, resp) {
        let sala_Model = new Sala_Model();
        let lista_salas = await sala_Model.listar();
        resp.render("salas/listar_sala.ejs", { layout: "layout_admin_home.ejs", lista_salas });
    }

    listar_cadastro(req, resp) {
        let sala_para_alterar = undefined;
        resp.render("salas/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", sala_para_alterar });
    }

    async cadastrar_sala(req, resp) {
        const nome = req.body.sala?.trim() || "";
        const capacidadeStr = req.body.qntd_alunos?.trim() || "";

      
        const nomeValido = /^[a-zA-Z0-9\s]+$/.test(nome);
        if (!nomeValido) {
            return resp.send({ ok: false, msg: "Nome da sala inválido: não use símbolos." });
        }

        const capacidadeValida = /^\d+$/.test(capacidadeStr) && Number(capacidadeStr) > 0;
        if (!capacidadeValida) {
            return resp.send({ ok: false, msg: "Quantidade de alunos inválida: use apenas números inteiros positivos." });
        }

       
        let sala_M = new Sala_Model();
        const lista_salas = await sala_M.listar();
        const jaExiste = lista_salas.some(s => s.sala.toLowerCase() === nome.toLowerCase());
        if (jaExiste) {
            return resp.send({ ok: false, msg: "Já existe uma sala com esse nome." });
        }

        sala_M.sala = nome;
        sala_M.capacidade_alunos = Number(capacidadeStr);

        let sucesso = await sala_M.inserir();
        if (sucesso) {
            resp.send({ ok: true, msg: "Sala cadastrada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao inserir a Sala" });
        }
    }

    async excluir_ano_letivo(req, resp) {
        let sala_M = new Sala_Model();
        sala_M.id = req.body.id;

        let sucesso = await sala_M.excluir();
        resp.send({ ok: sucesso });
    }

    async listar_editar(req, resp) {
        const id = req.params.id;
        let sala_M = new Sala_Model();
        let sala_para_alterar = await sala_M.obter(id);
        sala_para_alterar = sala_para_alterar[0];

        resp.render("salas/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", sala_para_alterar });
    }

    async editar_sala(req, resp) {
        const nome = req.body.sala?.trim() || "";
        const capacidadeStr = req.body.qntd_alunos?.trim() || "";
        const idAtual = Number(req.body.id);

     
        const nomeValido = /^[a-zA-Z0-9\s]+$/.test(nome);
        if (!nomeValido) {
            return resp.send({ ok: false, msg: "Nome da sala inválido: não use símbolos." });
        }

       
        const capacidadeValida = /^\d+$/.test(capacidadeStr) && Number(capacidadeStr) > 0;
        if (!capacidadeValida) {
            return resp.send({ ok: false, msg: "Quantidade de alunos inválida: use apenas números inteiros positivos." });
        }

       
        let sala_M = new Sala_Model();
        const lista_salas = await sala_M.listar();
        const jaExiste = lista_salas.some(s =>
            s.sala.toLowerCase() === nome.toLowerCase() && s.id !== idAtual
        );
        if (jaExiste) {
            return resp.send({ ok: false, msg: "Já existe uma sala com esse nome." });
        }

        sala_M.id = idAtual;
        sala_M.sala = nome;
        sala_M.capacidade_alunos = Number(capacidadeStr);

        let sucesso = await sala_M.atualizar();
        if (sucesso) {
            resp.send({ ok: true, msg: "Sala editada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao editar a Sala" });
        }
    }
}

module.exports = Sala_Controller;
