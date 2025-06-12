const perfil_Model = require("../models/perfil_model");
const perfil_M = new perfil_Model();

class perfil_Controller {
    async aluno_Perfil(req, res) {
        try {
            const cpf = req.cookies.usuario_logado;

            const dados = await perfil_M.obterDadosAluno(cpf);
            const aluno = dados[0] || {}; // Garante que aluno seja um objeto vazio se dados[0] for undefined
            
            res.render("perfis/perfil_aluno", {
                layout: "layout_aluno_home.ejs",
                aluno
            });
        } catch (err) {
            console.error("Erro no perfil do aluno:", err);
            // Opcional: Renderizar uma página de erro ou redirecionar
            res.status(500).send("Erro ao carregar perfil do aluno.");
        }
    }

    async professor_Perfil(req, res) {
        try {
            const cpf = req.cookies.usuario_logado;

            const dados = await perfil_M.obterDadosProfessor(cpf);
            const professor = dados[0] || {};

            res.render("perfis/perfil_professor", {
                layout: "layout_professor_home.ejs",
                professor
            });
        } catch (err) {
            console.error("Erro no perfil do professor:", err);
            res.status(500).send("Erro ao carregar perfil do professor.");
        }
    }

    async admin_Perfil(req, res) {
        try {
            const cpf = req.cookies.usuario_logado;

            const dados = await perfil_M.obterDadosAdmin(cpf);
            const admin = dados[0] || {};

            res.render("perfis/perfil_admin", {
                layout: "layout_admin_home.ejs",
                admin
            });
        } catch (err) {
            console.error("Erro no perfil do admin:", err);
            res.status(500).send("Erro ao carregar perfil do administrador.");
        }
    }
}

module.exports = perfil_Controller;