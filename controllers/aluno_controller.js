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
            const { cpf, nome, data, email, fone, rua, bairro, convenio, senha } = req.body;

            if (!cpf || !nome || !data || !email || !fone || !rua || !bairro || !convenio || !senha) {
                return res.send({ ok: false, msg: "Todos os campos são obrigatórios" });
            }

            const cpfLimpo = cpf.replace(/\D/g, '');
            if (!/^\d{11}$/.test(cpfLimpo)) {
                return res.send({ ok: false, msg: "CPF inválido: deve conter exatamente 11 dígitos numéricos" });
            }

            if (!/^[A-ZÀ-Ý][a-zà-ÿ]+(\s[A-ZÀ-Ý][a-zà-ÿ]+)+$/.test(nome)) {
                return res.send({
                    ok: false,
                    msg: "Nome inválido: deve conter nome e sobrenome, ambos iniciando com letra maiúscula"
                });
            }

            const nascimento = new Date(data);
            const hoje = new Date();
            const idade = hoje.getFullYear() - nascimento.getFullYear();
            const aniversarioJaPassou = hoje.getMonth() > nascimento.getMonth() ||
                (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
            const idadeFinal = aniversarioJaPassou ? idade : idade - 1;
            if (idadeFinal >= 18) {
                return res.send({ ok: false, msg: "O aluno deve ter menos de 18 anos" });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.send({ ok: false, msg: "Email inválido" });
            }

            if (senha.length < 6) {
                return res.send({ ok: false, msg: "A senha deve conter no mínimo 6 caracteres" });
            }

            const telefoneNumeros = fone.replace(/\D/g, '');
            if (!/^\d{11}$/.test(telefoneNumeros)) {
                return res.send({ ok: false, msg: "Telefone inválido: deve conter exatamente 11 dígitos incluindo o DDD" });
            }

            const pessoaExistente = new PessoaModel();
            const dadosExistentes = await pessoaExistente.obter(cpfLimpo);
            if (dadosExistentes) {
                return res.send({ ok: false, msg: "CPF já cadastrado no sistema" });
            }

            const db = new Database();
            const emailExistente = await db.ExecutaComando("SELECT * FROM logins WHERE usuario = ?", [email]);
            if (emailExistente && emailExistente.length > 0) {
                return res.send({ ok: false, msg: "Email já cadastrado como usuário no sistema" });
            }

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
                return res.send({ ok: false, msg: "Erro ao cadastrar Pessoa" });
            }

            let aluno_M = new AlunoModel();
            aluno_M.cpf = cpfLimpo;
            aluno_M.convenio = convenio;

            const resultadoAluno = await aluno_M.inserir();
            if (!resultadoAluno) {
                await pessoa_M.excluir();
                return res.send({ ok: false, msg: "Erro ao cadastrar Aluno" });
            }

            let loginNovo = new LoginModel();
            loginNovo.pessoa_cpf = cpfLimpo;
            loginNovo.usuario = email;
            loginNovo.senha = senha;
            loginNovo.perfil = 1;

            const resultadoLogin = await loginNovo.inserir();
            if (!resultadoLogin) {
                await aluno_M.excluir();
                await pessoa_M.excluir();
                return res.send({ ok: false, msg: "Erro ao cadastrar login do Aluno" });
            }

            res.send({ ok: true, msg: "Aluno cadastrado com sucesso" });

        } catch (erro) {
            console.error("Erro ao cadastrar aluno:", erro);
            res.send({ ok: false, msg: "Erro interno: " + erro.message });
        }
    }

    async editar_Aluno(req, res) {
        try {
            const { cpf, nome, data, email, fone, rua, bairro, convenio } = req.body;

            const cpfLimpo = cpf.replace(/\D/g, '');
            if (!/^\d{11}$/.test(cpfLimpo)) {
                return res.send({ ok: false, msg: "CPF inválido: deve conter exatamente 11 dígitos" });
            }

            if (!/^[A-ZÀ-Ý][a-zà-ÿ]+(\s[A-ZÀ-Ý][a-zà-ÿ]+)+$/.test(nome)) {
                return res.send({
                    ok: false,
                    msg: "Nome inválido: deve conter nome e sobrenome, ambos iniciando com letra maiúscula"
                });
            }

            const nascimento = new Date(data);
            const hoje = new Date();
            const idade = hoje.getFullYear() - nascimento.getFullYear();
            const aniversarioJaPassou = hoje.getMonth() > nascimento.getMonth() ||
                (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
            const idadeFinal = aniversarioJaPassou ? idade : idade - 1;
            if (idadeFinal >= 18) {
                return res.send({ ok: false, msg: "O aluno deve ter menos de 18 anos" });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.send({ ok: false, msg: "Email inválido" });
            }

            const telefoneNumeros = fone.replace(/\D/g, '');
            if (!/^\d{11}$/.test(telefoneNumeros)) {
                return res.send({ ok: false, msg: "Telefone inválido: deve conter exatamente 11 dígitos com DDD" });
            }

            let pessoa_M = new PessoaModel();
            pessoa_M.cpf = cpfLimpo;
            pessoa_M.nome = nome;
            pessoa_M.data = data;
            pessoa_M.email = email;
            pessoa_M.fone = telefoneNumeros;
            pessoa_M.rua = rua;
            pessoa_M.bairro = bairro;
            pessoa_M.convenio = convenio;

            let pessoaAtualizada = await pessoa_M.atualizar();

            if (pessoaAtualizada) {
                let aluno_M = new AlunoModel();
                aluno_M.cpf = cpfLimpo;
                aluno_M.convenio = convenio;
                let alunoAtualizado = await aluno_M.atualizar();

                if (alunoAtualizado) {
                    res.send({ ok: true, msg: "Aluno atualizado com sucesso" });
                } else {
                    res.send({ ok: false, msg: "Erro ao atualizar dados do aluno" });
                }
            } else {
                res.send({ ok: false, msg: "Erro ao atualizar dados pessoais" });
            }

        } catch (error) {
            console.error("Erro ao editar aluno:", error);
            res.send({ ok: false, msg: "Erro interno do servidor" });
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
        res.json({ ok: resultado, msg: msg });
    }

}

module.exports = Aluno_Controller;
