const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Login_Model = require("../models/login_model");
const Database = require("../utils/database");

class Professor_Controller {

    async home_view(req, resp){
        try {
            // Buscar lista de professores para exibir na home do professor
            let professor = new Professor_Model();
            let listaProfessores = await professor.listar();
            
            resp.render("professor/professor_home_view.ejs", { 
                layout: "layout_professor_home.ejs",
                professores: listaProfessores || [] // Garantir que sempre exista, mesmo que vazio
            });
        } catch (error) {
            console.error("Erro ao carregar home do professor:", error);
            resp.render("professor/professor_home_view.ejs", { 
                layout: "layout_professor_home.ejs",
                professores: [] // Array vazio em caso de erro
            });
        }
    }

    // Métodos para área do professor
    async listar_view(req, resp) {
        // Redirecionar para a página inicial do professor, já que o CRUD foi movido para área admin
        resp.redirect("/professor/home");
    }

    // Métodos para área administrativa
    async listar_view_admin(req, resp) {
        try {
            let professor = new Professor_Model();
            let listaProfessores = await professor.listar(); 
            
            resp.render("professores/listar_professores.ejs", { 
                layout: "layout_admin_home.ejs",
                professores: listaProfessores 
            });
        } catch (error) {
            console.error("Erro ao listar professores:", error);
            resp.render("professores/listar_professores.ejs", { 
                layout: "layout_admin_home.ejs",
                professores: [],
                erro: "Erro ao carregar lista de professores" 
            });
        }
    }

    listar_cadastroProf(req, resp) {
        resp.render("professor/professor_cadastro_view.ejs", { layout: "layout_professor_home.ejs" });
    }

    listar_cadastroProf_admin(req, resp) {
        resp.render("professores/cadastrar_professor.ejs", { layout: "layout_admin_home.ejs" });
    }

    async cadastrar_Prof(req, resp) {
        try {
            // Get data from request body (now as JSON)
            const { 
                cpf, 
                nome, 
                dt_nascimento, 
                rua, 
                bairro, 
                email, 
                telefone, 
                senha, 
                titulacao, 
                dt_admissao 
            } = req.body;

            // Validar CPF (formato e algoritmo)
            const cpfLimpo = cpf.replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                return resp.send({ ok: false, msg: "CPF inválido: deve conter 11 dígitos" });
            }

            // Verificar se todos os dígitos são iguais (CPF inválido)
            if (/^(\d)\1{10}$/.test(cpfLimpo)) {
                return resp.send({ ok: false, msg: "CPF inválido: dígitos repetidos" });
            }

            // Validação do primeiro dígito verificador
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
            }

            let resto = soma % 11;
            let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

            if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) {
                return resp.send({ ok: false, msg: "CPF inválido: primeiro dígito verificador incorreto" });
            }

            // Validação do segundo dígito verificador
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
            }

            resto = soma % 11;
            let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

            if (digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))) {
                return resp.send({ ok: false, msg: "CPF inválido: segundo dígito verificador incorreto" });
            }
            
            // Verificar se o CPF já existe como pessoa
            let pessoaExistente = new Pessoa_Model();
            let dadosPessoa = await pessoaExistente.obter(cpfLimpo);
            if (dadosPessoa) {
                return resp.send({ ok: false, msg: "CPF já cadastrado no sistema" });
            }
            
            // Verificar se o email já existe como usuário
            let db = new Database();
            let emailExistente = await db.ExecutaComando("SELECT * FROM logins WHERE usuario = ?", [email]);
            if (emailExistente && emailExistente.length > 0) {
                return resp.send({ ok: false, msg: "Email já cadastrado como usuário no sistema" });
            }
            
            // Validar datas
            const dataNascimento = new Date(dt_nascimento);
            const dataAdmissao = new Date(dt_admissao);
            const hoje = new Date();

            // Verificar se as datas são válidas
            if (isNaN(dataNascimento.getTime()) || isNaN(dataAdmissao.getTime())) {
                return resp.send({ ok: false, msg: "Data de nascimento ou admissão inválida" });
            }

            // Verificar se a data de admissão não é futura
            if (dataAdmissao > hoje) {
                return resp.send({ ok: false, msg: "Data de admissão não pode ser futura" });
            }

            // Calcular idade na data de admissão
            let idadeNaAdmissao = dataAdmissao.getFullYear() - dataNascimento.getFullYear();
            const mesAdmissao = dataAdmissao.getMonth();
            const diaAdmissao = dataAdmissao.getDate();
            const mesNascimento = dataNascimento.getMonth();
            const diaNascimento = dataNascimento.getDate();

            // Ajustar a idade se ainda não tinha feito aniversário na data de admissão
            if (mesAdmissao < mesNascimento || (mesAdmissao === mesNascimento && diaAdmissao < diaNascimento)) {
                idadeNaAdmissao--;
            }

            // Verificar se tinha pelo menos 18 anos na data de admissão
            if (idadeNaAdmissao < 18) {
                return resp.send({ ok: false, msg: "Professor deve ter pelo menos 18 anos na data de admissão" });
            }

            // Validação do telefone - adicionar após a validação do CPF
            const telefoneNumeros = telefone.replace(/\D/g, '');
            if (telefoneNumeros.length !== 10 && telefoneNumeros.length !== 11) {
                return resp.send({ 
                    ok: false, 
                    msg: "Telefone inválido: deve ter 10 dígitos (fixo) ou 11 dígitos (celular)" 
                });
            }

            // Validar formato do telefone (DDD + número)
            const ddd = telefoneNumeros.substring(0, 2);
            const numerosValidos = parseInt(ddd) >= 11 && parseInt(ddd) <= 99;
            if (!numerosValidos) {
                return resp.send({ 
                    ok: false, 
                    msg: "DDD inválido: deve estar entre 11 e 99" 
                });
            }

            // Se for celular (11 dígitos), validar se começa com 9
            if (telefoneNumeros.length === 11 && telefoneNumeros[2] !== '9') {
                return resp.send({ 
                    ok: false, 
                    msg: "Número de celular deve começar com 9" 
                });
            }

            // Criar pessoa (atualizar para usar o telefone validado)
            let pessoa = new Pessoa_Model();
            pessoa.cpf = cpf;
            pessoa.nome = nome;
            pessoa.data = dt_nascimento;
            pessoa.rua = rua;
            pessoa.bairro = bairro;
            pessoa.email = email;
            pessoa.fone = telefoneNumeros; // Usar o número já formatado

            // Criar professor
            let professor = new Professor_Model();
            professor.cpf = cpf;
            professor.titulacao = titulacao;
            professor.dataAdmissao = dt_admissao;

            // Criar login (usuário)
            let login = new Login_Model();
            login.pessoa_cpf = cpf;
            login.usuario = email;
            login.senha = senha;
            login.perfil = 2; // Perfil de professor

            // Inserir pessoa
            let resultadoPessoa = await pessoa.inserir();
            if (!resultadoPessoa) {
                return resp.send({ ok: false, msg: "Erro ao cadastrar Pessoa" });
            }

            // Inserir professor
            let resultadoProfessor = await professor.inserir();
            if (!resultadoProfessor) {
                // Rollback - excluir pessoa se falhar ao inserir professor
                await pessoa.excluir();
                return resp.send({ ok: false, msg: "Erro ao cadastrar Professor" });
            }

            // Inserir login
            let resultadoLogin = await login.inserir();
            if (!resultadoLogin) {
                // Rollback - excluir professor e pessoa se falhar ao inserir login
                await professor.excluir();
                await pessoa.excluir();
                return resp.send({ ok: false, msg: "Erro ao cadastrar login do Professor" });
            }

            // Success response as JSON
            resp.send({ ok: true, msg: "Professor cadastrado com sucesso!" });
        } catch (error) {
            console.error("Erro ao cadastrar professor:", error);
            resp.send({ ok: false, msg: "Erro ao processar cadastro: " + error.message });
        }
    }

    async excluir_Prof(req, resp) {
        try {
            let cpf = req.body.cpf;
            
            // Verificar se o professor existe
            let professor = new Professor_Model();
            professor.cpf = cpf;
            let dadosProfessor = await professor.obter(cpf);
            if (!dadosProfessor) {
                return resp.send({ ok: false, msg: "Professor não encontrado" });
            }
            
            // Excluir login primeiro (para manter integridade referencial)
            let login = new Login_Model();
            login.pessoa_cpf = cpf;
            await login.excluir();
            
            // Excluir professor
            let resultadoProfessor = await professor.excluir();
            if (!resultadoProfessor) {
                return resp.send({ ok: false, msg: "Erro ao excluir professor" });
            }
            
            // Excluir pessoa
            let pessoa = new Pessoa_Model();
            pessoa.cpf = cpf;
            let resultadoPessoa = await pessoa.excluir();
            if (!resultadoPessoa) {
                return resp.send({ ok: false, msg: "Erro ao excluir dados pessoais do professor" });
            }
            
            // Sucesso
            if (resultadoProfessor && resultadoPessoa) {
                resp.send({ ok: true, msg: "Professor excluído com sucesso!" });
            } else {
                resp.send({ ok: false, msg: "Erro ao excluir professor" });
            }
        } catch (error) {
            console.error(error);
            resp.send({ ok: false, msg: "Erro ao excluir professor: " + error.message });
        }
    }

    async listar_editar(req, resp) {
        try {
            let cpf = req.params.cpf;
            let professor = new Professor_Model();
            let pessoa = new Pessoa_Model();
            
            let dadosProfessor = await professor.obter(cpf);
            let dadosPessoa = await pessoa.obter(cpf);
            
            if (!dadosProfessor || !dadosPessoa) {
                return resp.redirect("/professor");
            }
            
            // Combinar dados do professor e pessoa
            let dados = {
                ...dadosProfessor,
                ...dadosPessoa
            };
            
            resp.render("professor/professor_editar_view.ejs", { 
                layout: "layout_professor_home.ejs",
                professor: dados 
            });
        } catch (error) {
            console.error("Erro ao carregar dados para edição:", error);
            resp.redirect("/professor");
        }
    }

    async listar_editar_admin(req, resp) {
        try {
            let cpf = req.params.cpf;
            let professor = new Professor_Model();
            let pessoa = new Pessoa_Model();
            
            let dadosProfessor = await professor.obter(cpf);
            let dadosPessoa = await pessoa.obter(cpf);
            
            if (!dadosProfessor || !dadosPessoa) {
                return resp.redirect("/admin/professores");
            }
            
            // Combinar dados do professor e pessoa
            let dados = {
                ...dadosProfessor,
                ...dadosPessoa
            };
            
            resp.render("professores/editar_professor.ejs", { 
                layout: "layout_admin_home.ejs",
                professor: dados 
            });
        } catch (error) {
            console.error("Erro ao carregar dados para edição:", error);
            resp.redirect("/admin/professores");
        }
    }

    async editar_Prof(req, resp) {
        try {
            const { cpf, nome, email, telefone, titulacao } = req.body;
            
            // Verificar se o professor existe
            let professorCheck = new Professor_Model();
            let dadosProfessor = await professorCheck.obter(cpf);
            if (!dadosProfessor) {
                return resp.send({ ok: false, msg: "Professor não encontrado" });
            }
            
            // Atualizar dados do professor
            let professor = new Professor_Model();
            professor.cpf = cpf;
            professor.titulacao = titulacao;
            professor.dataAdmissao = dadosProfessor.dataAdmissao; // Manter a data de admissão original
            
            // Atualizar dados da pessoa
            let pessoa = new Pessoa_Model();
            let dadosPessoa = await pessoa.obter(cpf);
            
            pessoa.cpf = cpf;
            pessoa.nome = nome;
            pessoa.email = email;
            pessoa.fone = telefone;
            pessoa.data = dadosPessoa.data; // Manter a data de nascimento original
            pessoa.rua = dadosPessoa.rua; // Manter a rua original
            pessoa.bairro = dadosPessoa.bairro; // Manter o bairro original
            
            // Atualizar login (email/usuário)
            let login = new Login_Model();
            login.pessoa_cpf = cpf;
            login.usuario = email;
            login.perfil = 2; // Perfil de professor
            
            // Obter senha atual para não alterá-la
            let db = new Database();
            let dadosLogin = await db.ExecutaComando("SELECT senha FROM logins WHERE pessoa_cpf = ?", [cpf]);
            if (dadosLogin && dadosLogin.length > 0) {
                login.senha = dadosLogin[0].senha;
            } else {
                return resp.send({ ok: false, msg: "Erro ao obter dados de login do professor" });
            }
            
            // Executar atualizações
            let resultadoProfessor = await professor.atualizar();
            let resultadoPessoa = await pessoa.atualizar();
            let resultadoLogin = await login.atualizar();
            
            if (resultadoProfessor && resultadoPessoa && resultadoLogin) {
                resp.send({ ok: true, msg: "Professor atualizado com sucesso!" });
            } else {
                resp.send({ ok: false, msg: "Erro ao atualizar professor" });
            }
        } catch (error) {
            console.error("Erro ao editar professor:", error);
            resp.send({ ok: false, msg: "Erro ao processar edição: " + error.message });
        }
    }
}

module.exports = Professor_Controller;