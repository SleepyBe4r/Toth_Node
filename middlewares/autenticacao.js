const Login_Model = require("../models/login_model");


class Autenticacao {

    async validar_Aluno(req, resp, next){
        if (req.cookies.usuario_logado) {
            let usu_Id = req.cookie.usuario_logado;
            let login_M =  new Login_Model();
            let usuario_lista = await login_M.obter(usu_Id);

            if(usuario_lista.length > 0){
                if (usuario_lista[0].perfil == 3) {
                    resp.locals.usuario = usuario_lista[0];
                    next();
                }
            }
        }
        resp.redirect("/login");
    }

    async validar_Funcionario(req, resp, next){
        if (req.cookies.usuario_logado) {
            let usu_Id = req.cookie.usuario_logado;
            let login_M =  new Login_Model();
            let usuario_lista = await login_M.obter(usu_Id);

            if(usuario_lista.length > 0){
                if (usuario_lista[0].perfil == 1 || usuario_lista[0].perfil == 2) {
                    resp.locals.usuario = usuario_lista[0];
                    next();
                }
            }
        }
        resp.redirect("/login");
    }

    async validar_Admin(req, resp, next){
        if (req.cookies.usuario_logado) {
            let usu_Id = req.cookie.usuario_logado;
            let login_M =  new Login_Model();
            let usuario_lista = await login_M.obter(usu_Id);

            if(usuario_lista.length > 0){
                if (usuario_lista[0].perfil == 1) {
                    resp.locals.usuario = usuario_lista[0];
                    console.log(res.locals);
                    
                    next();
                }
            }
        }
        resp.redirect("/login");
    }

    async validar_Professor(req, resp, next){
        if (req.cookies.usuario_logado) {
            let usu_Id = req.cookie.usuario_logado;
            let login_M =  new Login_Model();
            let usuario_lista = await login_M.obter(usu_Id);

            if(usuario_lista.length > 0){
                if (usuario_lista[0].perfil == 2) {
                    resp.locals.usuario = usuario_lista[0];
                    console.log(res.locals);
                    
                    next();
                }
            }
        }
        resp.redirect("/login");
    }
}

module.exports = Autenticacao;