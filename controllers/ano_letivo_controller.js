const Ano_Letivo_Model = require("../models/ano_letivo_model");

class Ano_Letivo_Controller {

    async listar_view(req, resp) {
        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();
        resp.render("ano_letivo/listar_ano_letivo.ejs", { layout: "layout_admin_home.ejs", lista_anos });
    }

    listar_cadastro(req, resp) {
        let ano_letivo_para_alterar = undefined;
        resp.render("ano_letivo/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", ano_letivo_para_alterar });
    }

    async cadastrar_ano_letivo(req, resp) {
        const ano_letivo_input = req.body.ano_letivo?.trim();

        // Verificação de campo vazio
        if (!ano_letivo_input) {
            resp.send({
                ok: false,
                msg: "Campo incompleto"
            });
            return;
        }

        const regex = /^[0-9]{4}$/;
        if (!regex.test(ano_letivo_input)) {
            resp.send({
                ok: false,
                msg: "Ano letivo inválido. Use um ano com 4 dígitos (ex: 2025)."
            });
            return;
        }

        
        let ano_letivo_M = new Ano_Letivo_Model();
        let anos_existentes = await ano_letivo_M.listar();
        const ano_ja_existe = anos_existentes.some(a => a.ano_letivo === ano_letivo_input);

        if (ano_ja_existe) {
            resp.send({
                ok: false,
                msg: "Este ano letivo já está cadastrado."
            });
            return;
        }

        ano_letivo_M.ano_letivo = ano_letivo_input;
        const resultado = await ano_letivo_M.inserir();

        if (resultado) {
            resp.send({
                ok: true,
                msg: "Ano letivo cadastrado com sucesso"
            });
        } else {
            resp.send({
                ok: false,
                msg: "Erro ao inserir o ano letivo"
            });
        }
    }

    async excluir_ano_letivo(req, resp) {
        let ano_letivo_M = new Ano_Letivo_Model();
        ano_letivo_M.id = req.body.id;

        let lista_ano_letivo = await ano_letivo_M.excluir();
        if (lista_ano_letivo) {
            resp.send({ ok: true });
        } else {
            resp.send({ ok: false });
        }
    }

    async listar_editar(req, resp) {
        const id = req.params.id;
        let ano_letivo_M = new Ano_Letivo_Model();
        let ano_letivo_para_alterar = await ano_letivo_M.obter(id);
        ano_letivo_para_alterar = ano_letivo_para_alterar[0];

        resp.render("ano_letivo/cadastrar_view.ejs", {
            layout: "layout_admin_home.ejs",
            ano_letivo_para_alterar
        });
    }

    async editar_ano_letivo(req, resp) {
        const ano_letivo_input = req.body.ano_letivo?.trim();

        if (!ano_letivo_input) {
            resp.send({
                ok: false,
                msg: "Campo incompleto"
            });
            return;
        }

        const regex = /^[0-9]{4}$/;
        if (!regex.test(ano_letivo_input)) {
            resp.send({
                ok: false,
                msg: "Ano letivo inválido. Use um ano com 4 dígitos (ex: 2025)."
            });
            return;
        }

        let ano_letivo_M = new Ano_Letivo_Model();
        let anos_existentes = await ano_letivo_M.listar();
        const ano_ja_existe = anos_existentes.some(
            a => a.ano_letivo === ano_letivo_input && a.id != req.body.id
        );

        if (ano_ja_existe) {
            resp.send({
                ok: false,
                msg: "Este ano letivo já está cadastrado."
            });
            return;
        }

        ano_letivo_M.id = req.body.id;
        ano_letivo_M.ano_letivo = ano_letivo_input;

        const resultado = await ano_letivo_M.atualizar();

        if (resultado) {
            resp.send({
                ok: true,
                msg: "Ano letivo editado com sucesso"
            });
        } else {
            resp.send({
                ok: false,
                msg: "Erro ao editar o ano letivo"
            });
        }
    }
}

module.exports = Ano_Letivo_Controller;
