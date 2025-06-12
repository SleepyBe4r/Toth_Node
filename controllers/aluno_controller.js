const AlunoModel = require("../models/aluno_model");
const PessoaModel = require("../models/pessoa_model");
const LoginModel = require("../models/login_model");
const Database = require("../utils/database");

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
        try {
            const {
                cpf,
                nome,
                data,
                email,
                fone,
                rua,
                bairro,
                convenio,
                senha
            } = req.body;

            // Verificar se todos os campos obrigatórios foram preenchidos
            if (!cpf || !nome || !data || !email || !fone || !rua || !bairro || !convenio || !senha) {
                return res.send({
                    ok: false,
                    msg: "Todos os campos são obrigatórios"
                });
            }

            const cpfLimpo = cpf.replace(/\D/g, '');
            const telefoneNumeros = fone.replace(/\D/g, '');

            // Verificar se o CPF já existe
            const pessoaExistente = new PessoaModel();
            const dadosExistentes = await pessoaExistente.obter(cpfLimpo);
            if (dadosExistentes) {
                return res.send({
                    ok: false,
                    msg: "CPF já cadastrado no sistema"
                });
            }

            // Verificar se o email já está em uso
            const db = new Database();
            const emailExistente = await db.ExecutaComando("SELECT * FROM logins WHERE usuario = ?", [email]);
            if (emailExistente && emailExistente.length > 0) {
                return res.send({
                    ok: false,
                    msg: "Email já cadastrado como usuário no sistema"
                });
            }

            // Criar pessoa
            let pessoa_M = new PessoaModel();
            pessoa_M.cpf = cpfLimpo;
            pessoa_M.nome = nome;
            pessoa_M.data = data;
            pessoa_M.email = email;
            pessoa_M.fone = telefoneNumeros;
            pessoa_M.rua = rua;
            pessoa_M.bairro = bairro;
            pessoa_M.convenio = convenio;

            const resultadoPessoa = await pessoa_M.inserir();
            if (!resultadoPessoa) {
                return res.send({
                    ok: false,
                    msg: "Erro ao cadastrar Pessoa"
                });
            }

            // Criar aluno
            let aluno_M = new AlunoModel();
            aluno_M.cpf = cpfLimpo;
            aluno_M.convenio = convenio;

            const resultadoAluno = await aluno_M.inserir();
            if (!resultadoAluno) {
                await pessoa_M.excluir();
                return res.send({
                    ok: false,
                    msg: "Erro ao cadastrar Aluno"
                });
            }

            // Criar login
            let loginNovo = new LoginModel();
            loginNovo.pessoa_cpf = cpfLimpo;
            loginNovo.usuario = email;
            loginNovo.senha = senha;
            loginNovo.perfil = 1; // perfil 1: Aluno

            const resultadoLogin = await loginNovo.inserir();
            if (!resultadoLogin) {
                await aluno_M.excluir();
                await pessoa_M.excluir();
                return res.send({
                    ok: false,
                    msg: "Erro ao cadastrar login do Aluno"
                });
            }

            res.send({
                ok: true,
                msg: "Aluno cadastrado com sucesso"
            });

        } catch (erro) {
            console.error("Erro ao cadastrar aluno:", erro);
            res.send({
                ok: false,
                msg: "Erro interno: " + erro.message
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
