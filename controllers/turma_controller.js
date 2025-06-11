const Turma_Model = require("../models/turma_model");
const Serie_Model = require("../models/serie_model");

class Turma_Controller {

    async listar_view(req, resp) {
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();
        resp.render("turma/listar_turma.ejs", { layout: "layout_admin_home.ejs", lista_turmas });
    }

    async listar_cadastro(req, resp) {
        let turma_para_alterar = undefined;
        resp.render("turma/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", turma_para_alterar });
    }

    async cadastrar_turma(req, resp) {
        let nome_turma = req.body.turma?.trim() ?? "";

        if (nome_turma === "") {
            resp.send({ ok: false, msg: "Campo incompleto" });
            return;
        }

        if (!/^[a-zA-Z0-9\s]+$/.test(nome_turma)) {
            resp.send({ ok: false, msg: "O nome da turma não pode conter símbolos" });
            return;
        }

        let numeros = nome_turma.match(/\d/g);
        if (numeros && numeros.length > 1) {
            resp.send({ ok: false, msg: "O nome da turma pode conter no máximo 1 número" });
            return;
        }

        let turma_M = new Turma_Model();
        let turmas_existentes = await turma_M.listar();
        let nome_normalizado = nome_turma.toLowerCase();

        let ja_existe = turmas_existentes.some(t => t.turma.toLowerCase() === nome_normalizado);
        if (ja_existe) {
            resp.send({ ok: false, msg: "Já existe uma turma com esse nome" });
            return;
        }

        turma_M.turma = nome_turma;
        let resultado = await turma_M.inserir();

        if (resultado) {
            resp.send({ ok: true, msg: "Turma cadastrada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao inserir a Turma" });
        }
    }

    async excluir_turma(req, resp) {
        let turma_M = new Turma_Model();
        turma_M.id = req.body.id;

        let lista_turma = await turma_M.excluir();
        if (lista_turma) {
            resp.send({ ok: true });
        } else {
            resp.send({ ok: false });
        }
    }

    async listar_editar(req, resp) {
        const id = req.params.id;
        let turma_M = new Turma_Model();
        let turma_para_alterar = await turma_M.obter(id);
        turma_para_alterar = turma_para_alterar[0];

        resp.render("turma/cadastrar_view.ejs", {
            layout: "layout_admin_home.ejs",
            turma_para_alterar
        });
    }

    async editar_turma(req, resp) {
        let nome_turma = req.body.turma?.trim() ?? "";

        if (nome_turma === "") {
            resp.send({ ok: false, msg: "Campo incompleto" });
            return;
        }

        if (!/^[a-zA-Z0-9\s]+$/.test(nome_turma)) {
            resp.send({ ok: false, msg: "O nome da turma não pode conter símbolos" });
            return;
        }

        let numeros = nome_turma.match(/\d/g);
        if (numeros && numeros.length > 1) {
            resp.send({ ok: false, msg: "O nome da turma pode conter no máximo 1 número" });
            return;
        }

        let turma_M = new Turma_Model();
        let turmas_existentes = await turma_M.listar();
        let nome_normalizado = nome_turma.toLowerCase();

        let ja_existe = turmas_existentes.some(t =>
            t.turma.toLowerCase() === nome_normalizado && t.id != req.body.id
        );
        if (ja_existe) {
            resp.send({ ok: false, msg: "Já existe uma turma com esse nome" });
            return;
        }

        turma_M.id = req.body.id;
        turma_M.turma = nome_turma;

        let resultado = await turma_M.atualizar();

        if (resultado) {
            resp.send({ ok: true, msg: "Turma editada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao editar a Turma" });
        }
    }

    async ObterPorDisc(req, resp) {
        let cpf = req.cookies.usuario_Logado;
        let id = req.body.id_disciplina;
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.obterPorProf(id, cpf);
        let lista = [];

        lista_turmas.forEach(e => {
            lista.push({
                id: e["id"],
                nome: `${e["serie"]} - ${e["turma"]} - ${e["ano_letivo"]}`
            });
        });

        resp.send({ ok: true, lista: lista });
    }
}

module.exports = Turma_Controller;
