const Disciplina_Model = require("../models/disciplina_model");

class Disciplina_Controller {

    async listar_view(req, resp) {
        let disciplina_M = new Disciplina_Model();
        let lista_disciplina = await disciplina_M.listar();
        resp.render("disciplina/listar_disciplina.ejs", {
            layout: "layout_admin_home.ejs",
            lista_disciplina
        });
    }

    listar_cadastro(req, resp) {
        let disciplina_para_alterar = undefined;
        resp.render("disciplina/cadastrar_view.ejs", {
            layout: "layout_admin_home.ejs",
            disciplina_para_alterar
        });
    }

    async cadastrar_disciplina(req, resp) {
        const nome = req.body.nome ? req.body.nome.trim() : "";
        const carga_horariaStr = req.body.carga_horaria ? req.body.carga_horaria.trim() : "";

        const nomeValido = /^[A-Za-zÀ-ÿ\s]*\d?[A-Za-zÀ-ÿ\s]*$/.test(nome);
        const temLetra = /[A-Za-zÀ-ÿ]/.test(nome);
        const cargaValida = /^\d+$/.test(carga_horariaStr) && Number(carga_horariaStr) > 0;

        if (!nome || !temLetra || !nomeValido) {
            return resp.send({
                ok: false,
                msg: "Nome inválido: deve conter apenas letras (com acento), espaços e no máximo 1 número."
            });
        }

        if (!cargaValida) {
            return resp.send({
                ok: false,
                msg: "Carga horária inválida: deve ser um número inteiro positivo."
            });
        }

        let disciplina_M = new Disciplina_Model();
        disciplina_M.nome = nome;
        disciplina_M.carga_horaria = Number(carga_horariaStr);

        let lista_disciplina = await disciplina_M.listar();
        let disciplinaExiste = lista_disciplina.some(d => d.nome.toLowerCase() === nome.toLowerCase());

        if (disciplinaExiste) {
            return resp.send({
                ok: false,
                msg: "Já existe uma disciplina cadastrada com esse nome."
            });
        }

        let resultado = await disciplina_M.inserir();
        if (resultado) {
            resp.send({ ok: true, msg: "Disciplina cadastrada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao inserir a Disciplina" });
        }
    }

    async excluir_disciplina(req, resp) {
        let disciplina_M = new Disciplina_Model();
        disciplina_M.id = req.body.id;

        let resultado = await disciplina_M.excluir();
        if (resultado) {
            resp.send({ ok: true });
        } else {
            resp.send({ ok: false });
        }
    }

    async listar_editar(req, resp) {
        const id = req.params.id;
        let disciplina_M = new Disciplina_Model();
        let disciplina_para_alterar = await disciplina_M.obter(id);
        disciplina_para_alterar = disciplina_para_alterar[0];

        resp.render("disciplina/cadastrar_view.ejs", {
            layout: "layout_admin_home.ejs",
            disciplina_para_alterar
        });
    }

    async editar_disciplina(req, resp) {
        const nome = req.body.nome ? req.body.nome.trim() : "";
        const carga_horariaStr = req.body.carga_horaria ? req.body.carga_horaria.trim() : "";

        const nomeValido = /^[A-Za-zÀ-ÿ\s]*\d?[A-Za-zÀ-ÿ\s]*$/.test(nome);
        const temLetra = /[A-Za-zÀ-ÿ]/.test(nome);
        const cargaValida = /^\d+$/.test(carga_horariaStr) && Number(carga_horariaStr) > 0;

        if (!nome || !temLetra || !nomeValido) {
            return resp.send({
                ok: false,
                msg: "Nome inválido: deve conter apenas letras (com acento), espaços e no máximo 1 número."
            });
        }

        if (!cargaValida) {
            return resp.send({
                ok: false,
                msg: "Carga horária inválida: deve ser um número inteiro positivo."
            });
        }

        let disciplina_M = new Disciplina_Model();
        disciplina_M.id = Number(req.body.id);
        disciplina_M.nome = nome;
        disciplina_M.carga_horaria = Number(carga_horariaStr);

        let lista_disciplina = await disciplina_M.listar();
        let disciplinaExiste = lista_disciplina.some(d =>
            d.nome.toLowerCase() === nome.toLowerCase() &&
            d.id !== disciplina_M.id
        );

        if (disciplinaExiste) {
            return resp.send({
                ok: false,
                msg: "Já existe uma disciplina cadastrada com esse nome."
            });
        }

        let resultado = await disciplina_M.atualizar();
        if (resultado) {
            resp.send({ ok: true, msg: "Disciplina editada com sucesso" });
        } else {
            resp.send({ ok: false, msg: "Erro ao editar a Disciplina" });
        }
    }
}

module.exports = Disciplina_Controller;
