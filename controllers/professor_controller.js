const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Login_Model = require("../models/login_model");
const Database = require("../utils/database");

/**
 * Validações centralizadas para professores
 * Todas as validações foram movidas do frontend para o backend
 */
function validarDadosProfessor(dados, isEdicao = false) {
    const erros = {};

    // Validar campos obrigatórios
    if (!dados.nome || dados.nome.trim() === '') {
        erros.nome = 'Nome é obrigatório';
    } else if (dados.nome.length < 2) {
        erros.nome = 'Nome deve ter pelo menos 2 caracteres';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome)) {
        erros.nome = 'Nome deve conter apenas letras e espaços';
    }

    if (!dados.email || dados.email.trim() === '') {
        erros.email = 'E-mail é obrigatório';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dados.email)) {
            erros.email = 'E-mail inválido';
        }
    }

    if (!dados.telefone || dados.telefone.trim() === '') {
        erros.telefone = 'Telefone é obrigatório';
    } else {
        const telefoneNumeros = dados.telefone.replace(/\D/g, '');
        if (telefoneNumeros.length !== 10 && telefoneNumeros.length !== 11) {
            erros.telefone = 'Telefone deve ter 10 ou 11 dígitos';
        } else {
            const ddd = telefoneNumeros.substring(0, 2);
            if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
                erros.telefone = 'DDD inválido';
            }
           
        }
    }

    if (!dados.titulacao || dados.titulacao.trim() === '') {
        erros.titulacao = 'Titulação é obrigatória';
    }

    // Validações específicas para cadastro
    if (!isEdicao) {
        if (!dados.cpf || dados.cpf.trim() === '') {
            erros.cpf = 'CPF é obrigatório';
        } else {
            const cpfLimpo = dados.cpf.replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                erros.cpf = 'CPF deve ter 11 dígitos';
            } else if (/^(\d)\1{10}$/.test(cpfLimpo)) {
                erros.cpf = 'CPF inválido';
            } else {
                // Validação do algoritmo do CPF
                let soma = 0;
                for (let i = 0; i < 9; i++) {
                    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
                }
                let resto = soma % 11;
                let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
                
                if (digitoVerificador1 !== parseInt(cpfLimpo.charAt(9))) {
                    erros.cpf = 'CPF inválido';
                } else {
                    soma = 0;
                    for (let i = 0; i < 10; i++) {
                        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
                    }
                    resto = soma % 11;
                    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
                    
                    if (digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))) {
                        erros.cpf = 'CPF inválido';
                    }
                }
            }
        }

        if (!dados.dt_nascimento || dados.dt_nascimento.trim() === '') {
            erros.dt_nascimento = 'Data de nascimento é obrigatória';
        } else {
            const dataNascimento = new Date(dados.dt_nascimento);
            if (isNaN(dataNascimento.getTime())) {
                erros.dt_nascimento = 'Data de nascimento inválida';
            } else {
                const hoje = new Date();
                const idade = hoje.getFullYear() - dataNascimento.getFullYear();
                if (idade < 18) {
                    erros.dt_nascimento = 'Professor deve ter pelo menos 18 anos';
                }
            }
        }

        if (!dados.dt_admissao || dados.dt_admissao.trim() === '') {
            erros.dt_admissao = 'Data de admissão é obrigatória';
        } else {
            const dataAdmissao = new Date(dados.dt_admissao);
            if (isNaN(dataAdmissao.getTime())) {
                erros.dt_admissao = 'Data de admissão inválida';
            } else {
                const hoje = new Date();
                if (dataAdmissao > hoje) {
                    erros.dt_admissao = 'Data de admissão não pode ser futura';
                }
                
                if (dados.dt_nascimento) {
                    const dataNascimento = new Date(dados.dt_nascimento);
                    if (!isNaN(dataNascimento.getTime())) {
                        let idadeNaAdmissao = dataAdmissao.getFullYear() - dataNascimento.getFullYear();
                        const mesAdmissao = dataAdmissao.getMonth();
                        const diaAdmissao = dataAdmissao.getDate();
                        const mesNascimento = dataNascimento.getMonth();
                        const diaNascimento = dataNascimento.getDate();
                        
                        if (mesAdmissao < mesNascimento || (mesAdmissao === mesNascimento && diaAdmissao < diaNascimento)) {
                            idadeNaAdmissao--;
                        }
                        
                        if (idadeNaAdmissao < 18) {
                            erros.dt_admissao = 'Professor deve ter pelo menos 18 anos na data de admissão';
                        }
                    }
                }
            }
        }

        if (!dados.senha || dados.senha.trim() === '') {
            erros.senha = 'Senha é obrigatória';
        } else if (dados.senha.length < 6) {
            erros.senha = 'Senha deve ter pelo menos 6 caracteres';
        }

        if (!dados.rua || dados.rua.trim() === '') {
            erros.rua = 'Rua é obrigatória';
        }

        if (!dados.bairro || dados.bairro.trim() === '') {
            erros.bairro = 'Bairro é obrigatório';
        }
    }

    return {
        valido: Object.keys(erros).length === 0,
        erros: erros
    };
}

class Professor_Controller {

    async home_view(req, resp){
        try {
            // Buscar dados do professor logado
            const cpfProfessor = req.cookies.usuario_logado;
            
            let professor = new Professor_Model();
            let dadosProfessor = await professor.obter(cpfProfessor);
            
            // Buscar dados pessoais
            let pessoa = new Pessoa_Model();
            let dadosPessoa = await pessoa.obter(cpfProfessor);
            
            // Combinar dados do professor e pessoa
            let professorCompleto = null;
            if (dadosProfessor && dadosPessoa) {
                professorCompleto = {
                    ...dadosProfessor,
                    ...dadosPessoa,
                    nome: dadosPessoa.nome,
                    email: dadosPessoa.email
                };
            }
            
            resp.render("professor/professor_home_view.ejs", { 
                layout: "layout_professor_home.ejs",
                professor: professorCompleto
            });
        } catch (error) {
            console.error("Erro ao carregar home do professor:", error);
            resp.render("professor/professor_home_view.ejs", { 
                layout: "layout_professor_home.ejs",
                professor: null
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
    }    listar_cadastroProf(req, resp) {
        resp.render("professor/professor_cadastro_view.ejs", { layout: "layout_professor_home.ejs" });
    }

    listar_cadastroProf_admin(req, resp) {
        resp.render("professores/cadastrar_professor.ejs", { layout: "layout_admin_home.ejs" });
    }   
    
    async cadastrar_Prof(req, resp) {
        try {
            // Validar dados usando a função centralizada
            const validacao = validarDadosProfessor(req.body, false);
            
            if (!validacao.valido) {
                // Converter erros do formato {campo: mensagem} para [{campo, mensagem}]
                const errosFormatados = Object.keys(validacao.erros).map(campo => ({
                    campo: campo,
                    mensagem: validacao.erros[campo]
                }));
                
                return resp.send({ 
                    ok: false, 
                    msg: "Dados inválidos", 
                    erros: errosFormatados 
                });
            }

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

            const cpfLimpo = cpf.replace(/\D/g, '');
            
            // Verificar se o CPF já existe como pessoa
            let pessoaExistente = new Pessoa_Model();
            let dadosExistentes = await pessoaExistente.obter(cpfLimpo);
            if (dadosExistentes) {
                return resp.send({ ok: false, msg: "CPF já cadastrado no sistema" });
            }
            
            // Verificar se o email já existe como usuário
            let db = new Database();
            let emailExistente = await db.ExecutaComando("SELECT * FROM logins WHERE usuario = ?", [email]);
            if (emailExistente && emailExistente.length > 0) {
                return resp.send({ ok: false, msg: "Email já cadastrado como usuário no sistema" });
            }

            const telefoneNumeros = telefone.replace(/\D/g, '');

            // Criar pessoa
            let pessoaNova = new Pessoa_Model();
            pessoaNova.cpf = cpfLimpo;
            pessoaNova.nome = nome;
            pessoaNova.data = dt_nascimento;
            pessoaNova.rua = rua;
            pessoaNova.bairro = bairro;
            pessoaNova.email = email;
            pessoaNova.fone = telefoneNumeros;

            // Criar professor
            let professorNovo = new Professor_Model();
            professorNovo.cpf = cpfLimpo;
            professorNovo.titulacao = titulacao;
            professorNovo.dataAdmissao = dt_admissao;

            // Criar login
            let loginNovo = new Login_Model();
            loginNovo.pessoa_cpf = cpfLimpo;
            loginNovo.usuario = email;
            loginNovo.senha = senha;
            loginNovo.perfil = 2;

            // Inserir dados com transação
            let resultadoPessoa = await pessoaNova.inserir();
            if (!resultadoPessoa) {
                return resp.send({ ok: false, msg: "Erro ao cadastrar Pessoa" });
            }

            let resultadoProfessor = await professorNovo.inserir();
            if (!resultadoProfessor) {
                await pessoaNova.excluir();
                return resp.send({ ok: false, msg: "Erro ao cadastrar Professor" });
            }

            let resultadoLogin = await loginNovo.inserir();
            if (!resultadoLogin) {
                await professorNovo.excluir();
                await pessoaNova.excluir();
                return resp.send({ ok: false, msg: "Erro ao cadastrar login do Professor" });
            }

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

        // Excluir login
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
            return resp.send({ ok: true, msg: "Professor excluído com sucesso!" });
        } else {
            return resp.send({ ok: false, msg: "Erro ao excluir professor" });
        }
    } catch (error) {
        console.error(error);
        return resp.send({ ok: false, msg: "Erro ao excluir professor: " + error.message });
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
            resp.redirect("/admin/professores");        }
    }

    async editar_Prof(req, resp) {        try {
            // Validar dados usando a função centralizada
            const validacao = validarDadosProfessor(req.body, true);
            
            if (!validacao.valido) {
                // Converter erros do formato {campo: mensagem} para [{campo, mensagem}]
                const errosFormatados = Object.keys(validacao.erros).map(campo => ({
                    campo: campo,
                    mensagem: validacao.erros[campo]
                }));
                
                return resp.send({ 
                    ok: false, 
                    msg: "Dados inválidos", 
                    erros: errosFormatados 
                });
            }

            const { cpf, nome, email, telefone, titulacao } = req.body;
            
            // Verificar se o professor existe
            let professorCheck = new Professor_Model();
            let dadosProfessor = await professorCheck.obter(cpf);
            if (!dadosProfessor) {
                return resp.send({ ok: false, msg: "Professor não encontrado" });
            }

            const telefoneNumeros = telefone.replace(/\D/g, '');
            
            // Atualizar dados do professor
            let professor = new Professor_Model();
            professor.cpf = cpf;
            professor.titulacao = titulacao;
            professor.dataAdmissao = dadosProfessor.dataAdmissao;
            
            // Atualizar dados da pessoa
            let pessoa = new Pessoa_Model();
            let dadosPessoa = await pessoa.obter(cpf);
            
            pessoa.cpf = cpf;
            pessoa.nome = nome;
            pessoa.email = email;
            pessoa.fone = telefoneNumeros;
            pessoa.data = dadosPessoa.data;
            pessoa.rua = dadosPessoa.rua;
            pessoa.bairro = dadosPessoa.bairro;
            
            // Atualizar login
            let login = new Login_Model();
            login.pessoa_cpf = cpf;
            login.usuario = email;
            login.perfil = 2;
            
            // Obter senha atual
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
