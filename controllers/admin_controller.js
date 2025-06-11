const Professor_Model = require('../models/professor_model');
const Pessoa_Model = require('../models/pessoa_model');
const Login_Model = require('../models/login_model');

class Admin_Controller {
    home_view(req, resp){
        resp.render("admin/admin_home_view.ejs", { layout: "layout_admin_home.ejs"});
    }

    async excluir_Prof(req, resp) {
        try {
            let cpf = req.body.cpf;
            
            // Excluir login primeiro
            let login = new Login_Model();
            login.pessoa_cpf = cpf;
            await login.excluir();
            
            // Excluir professor
            let professor = new Professor_Model();
            professor.cpf = cpf;
            let resultadoProfessor = await professor.excluir();
            
            // Excluir pessoa
            let pessoa = new Pessoa_Model();
            pessoa.cpf = cpf;
            let resultadoPessoa = await pessoa.excluir();
            
            if (resultadoProfessor && resultadoPessoa) {
                resp.send(`<script>
                    alert('Professor excluído com sucesso!');
                    window.location.href = '/admin/professores';
                </script>`);
            } else {
                resp.send(`<script>
                    alert('Erro ao excluir professor');
                    window.location.href = '/admin/professores';
                </script>`);
            }
        } catch (error) {
            console.error(error);
            resp.send(`<script>
                alert('Erro ao excluir professor: ${error.message}');
                window.location.href = '/admin/professores';
            </script>`);
        }
    }
}

module.exports = Admin_Controller;