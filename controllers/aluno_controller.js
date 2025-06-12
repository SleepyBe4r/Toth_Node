const AlunoModel = require("../models/aluno_model");
const PessoaModel = require("../models/pessoa_model");
const loginModel = require("../models/login_model");

class Aluno_Controller {

    async home_view(req, resp) {
        resp.render("aluno/aluno_home_view.ejs", { layout: "layout_aluno_home.ejs" });
    }

    async listar_view_admin(req, res) {
        let aluno_M = new AlunoModel();
        let lista_alunos = await aluno_M.listar();
        res.render("aluno/aluno_listar.ejs", { layout: "layout_admin_home.ejs", lista_alunos });
    }

    async listar_cadastroAluno_admin(req, res) {
        res.render("aluno/aluno_cadastrar.ejs", { layout: "layout_admin_home.ejs" });
    }

    async cadastrar_Aluno(req, res) {
        if (
            req.body.cpf == "" ||
            req.body.nome == "" ||
            req.body.data == "" ||
            req.body.email == "" ||
            req.body.fone == "" ||
            req.body.rua == "" ||
            req.body.bairro == "" ||
            req.body.convenio == ""
        ) {
            res.send({
                ok: false,
                msg: "Campo incompleto"
            });
            return;
        }

        let pessoa_M = new PessoaModel();
        pessoa_M.cpf = req.body.cpf;
        pessoa_M.nome = req.body.nome;
        pessoa_M.data = req.body.data;
        pessoa_M.email = req.body.email;
        pessoa_M.fone = req.body.fone;
        pessoa_M.rua = req.body.rua;
        pessoa_M.bairro = req.body.bairro;
        pessoa_M.convenio = req.body.convenio;

        let pessoa = await pessoa_M.inserir();



        if (pessoa) {
            let aluno_M = new AlunoModel();
            aluno_M.cpf = req.body.cpf;  // Aqui também sem formatação
            aluno_M.convenio = req.body.convenio;
            let ok = await aluno_M.inserir();

            if (ok) {
                res.send({
                    ok: true,
                    msg: "Aluno cadastrado com sucesso"
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao inserir o Aluno"
                });
            }
        } else {
            res.send({
                pessoa: false,
                msg: "Erro ao cadastrar Pessoa"
            });
        }
    }

    async editar_Aluno(req, res) {
        try {

            console.log("Dados recebidos no backend:", req.body);

            let aluno_M = new AlunoModel();
            let pessoa_M = new PessoaModel();

            // Atualiza os dados da pessoa
            pessoa_M.cpf = req.body.cpf;  // Sem formatação
            pessoa_M.nome = req.body.nome;
            pessoa_M.data = req.body.data;
            pessoa_M.email = req.body.email;
            pessoa_M.fone = req.body.fone;
            pessoa_M.rua = req.body.rua;
            pessoa_M.bairro = req.body.bairro;
            pessoa_M.convenio = req.body.convenio;
            let pessoaAtualizada = await pessoa_M.atualizar();

            if (pessoaAtualizada) {
                // Atualiza os dados do aluno
                aluno_M.cpf = req.body.cpf;  // Sem formatação
                aluno_M.convenio = req.body.convenio;
                let alunoAtualizado = await aluno_M.atualizar();

                if (alunoAtualizado) {
                    res.send({
                        ok: true,
                        msg: "Aluno atualizado com sucesso"
                    });

                } else {
                    res.send({
                        ok: false,
                        msg: "Erro ao atualizar dados do aluno"
                    });
                }
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao atualizar dados pessoais"
                });
            }
        } catch (error) {
            console.error("Erro ao editar aluno:", error);
            res.send({
                ok: false,
                msg: "Erro interno do servidor"
            });
        }
    }

    

    async listar_editar_admin(req, resp) {
        try {
            let cpf = req.params.cpf;
            let aluno = new AlunoModel();
            let pessoa = new PessoaModel();

            let dadosAluno = await aluno.obter(cpf);
            let dadosPessoa = await pessoa.obter(cpf);

            if (!dadosAluno || !dadosPessoa) {
                return resp.redirect("/admin/alunos");
            }

            // Combinar dados do aluno e pessoa
            let dados = {
                ...dadosAluno,
                ...dadosPessoa
            };

            resp.render("aluno/aluno_editar_view.ejs", {
                layout: "layout_admin_home.ejs",
                aluno: dados
            });
        } catch (error) {
            console.error("Erro ao carregar dados para edição:", error);
            resp.redirect("/admin/alunos");
        }
    }

    async excluir_Aluno(req, res) {
        const aluno_M = new AlunoModel();
        aluno_M.cpf = req.body.cpf;
        const resultado = await aluno_M.excluir();
        let msg = "";
        if (resultado) {
            const pessoa_M = new PessoaModel();
            pessoa_M.cpf = req.body.cpf;
            const pessoa = await pessoa_M.excluir();
            if (pessoa) {
                msg = "Aluno excluído com sucesso!";
            } else {
                msg = "Não foi possível excluir";
            }
        } else {
            msg = "Não foi possível excluir ";
        }
        res.json({
            ok: resultado,
            msg: msg
        });
    }

}

module.exports = Aluno_Controller;
