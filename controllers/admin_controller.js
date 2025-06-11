const Professor_Model = require('../models/professor_model');
const Pessoa_Model = require('../models/pessoa_model');
const Login_Model = require('../models/login_model');

class Admin_Controller {
    home_view(req, resp){
        resp.render("admin/admin_home_view.ejs", { layout: "layout_admin_home.ejs"});
    }    async excluir_Prof(req, resp) {
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
            console.error("Erro ao excluir professor:", error);
            resp.send({ ok: false, msg: "Erro ao excluir professor: " + error.message });
        }
    }
}

module.exports = Admin_Controller;