const Professor_Model = require("../models/professor_model");
const Pessoa_Model = require("../models/pessoa_model");
const Login_Model = require("../models/login_model");

class Professor_Controller {

    async home_view(req, resp){
        resp.render("professor/professor_home_view.ejs", { layout: "layout_professor_home.ejs"});
    }

    // Métodos para área do professor
    async listar_view(req, resp) {
        // Redirecionar para a página inicial do professor, já que o CRUD foi movido para área admin
        resp.redirect("/professor/home");
    }

    // Métodos para área administrativa
    async listar_view_admin(req, resp) {
        let professor = new Professor_Model();
        let listaProfessores = await professor.listar(); 
        
        resp.render("admin/professores/listar_professores.ejs", { 
            layout: "layout_admin_home.ejs",
            professores: listaProfessores 
        });
    }

    listar_cadastroProf(req, resp) {
        resp.render("professor/professor_cadastro_view.ejs", { layout: "layout_professor_home.ejs" });
    }

    listar_cadastroProf_admin(req, resp) {
        resp.render("admin/professores/cadastrar_professor.ejs", { layout: "layout_admin_home.ejs" });
    }

    async cadastrar_Prof(req, resp) {
        try {
            let professor = new Professor_Model();
            let pessoa = new Pessoa_Model();
            let login = new Login_Model();

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

            // Validar titulação (deve ser um dos valores do enum)
            const titulacoesValidas = ['graduado', 'especialista', 'mestre', 'doutor'];
            if (!titulacoesValidas.includes(professor.titulacao)) {
                return resp.send({ ok: false, msg: "Titulação inválida. Deve ser: graduado, especialista, mestre ou doutor" });
            }

            let resultadopessoa = await pessoa.inserir();
            if(resultadopessoa) {
                let resultado = await professor.inserir();
                if(resultado) {
                    // Criar login para o professor (perfil 2 = professor)
                    login.pessoa_cpf = req.body.cpf;
                    login.usuario = req.body.email;
                    login.senha = req.body.senha;
                    login.id_perfil = 2; // Perfil de professor
                    
                    let resultadoLogin = await login.inserir();
                    if(resultadoLogin) {
                        resp.send({ ok: true, msg: "Professor cadastrado com sucesso!" });
                    } else {
                        resp.send({ ok: false, msg: "Erro ao cadastrar login do professor" });
                    }
                } else {
                    resp.send({ ok: false, msg: "Erro ao cadastrar professor" });
                }
            } else {
                resp.send({ ok: false, msg: "Erro ao cadastrar Pessoa" });
            }
        } catch (error) {
            console.error("Erro ao cadastrar professor:", error);
            resp.send({ ok: false, msg: "Erro ao processar cadastro: " + error.message });
        }
    }

    async excluir_Prof(req, resp) {
        try {
            let cpf = req.body.cpf;
            let professor = new Professor_Model();
            professor.cpf = cpf;
            let pessoa = new Pessoa_Model();
            pessoa.cpf = cpf;

            let resultado = await professor.excluir();
            let resultado2 = await pessoa.excluir();
            if(resultado && resultado2) {
                resp.send({ ok: true, msg: "Professor excluído com sucesso!" });
            } else {
                resp.send({ ok: false, msg: "Erro ao excluir professor" });
            }
        } catch (error) {
            console.error("Erro ao excluir professor:", error);
            resp.send({ ok: false, msg: "Erro ao processar exclusão: " + error.message });
        }
    }

    async listar_editar(req, resp) {
        let cpf = req.params.cpf;
        let professor = new Professor_Model();
        professor.cpf = cpf;

        let dados = await professor.obter(cpf);
        resp.render("professor/professor_editar_view.ejs", { 
            layout: "layout_professor_home.ejs",
            professor: dados 
        });
    }

    async listar_editar_admin(req, resp) {
        try {
            let cpf = req.params.cpf;
            let professor = new Professor_Model();
            let pessoa = new Pessoa_Model();
            
            let dadosProfessor = await professor.obter(cpf);
            let dadosPessoa = await pessoa.listar(cpf);
            
            if (!dadosProfessor || !dadosPessoa) {
                return resp.redirect("/admin/professores");
            }
            
            // Combinar dados do professor e pessoa
            let dados = {
                ...dadosProfessor,
                ...dadosPessoa
            };
            
            resp.render("admin/professores/editar_professor.ejs", { 
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
            let professor = new Professor_Model();
            let pessoa = new Pessoa_Model();
            
            professor.cpf = req.body.cpf;
            professor.titulacao = req.body.titulacao;
            professor.dataAdmissao = req.body.dt_admissao;
            
            pessoa.cpf = req.body.cpf;
            pessoa.nome = req.body.nome;
            pessoa.email = req.body.email;
            pessoa.fone = req.body.telefone;
            
            // Validar titulação (deve ser um dos valores do enum)
            const titulacoesValidas = ['graduado', 'especialista', 'mestre', 'doutor'];
            if (!titulacoesValidas.includes(professor.titulacao)) {
                return resp.send({ ok: false, msg: "Titulação inválida. Deve ser: graduado, especialista, mestre ou doutor" });
            }

            let resultadoProfessor = await professor.atualizar();
            let resultadoPessoa = await pessoa.atualizar();
            
            if(resultadoProfessor && resultadoPessoa) {
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