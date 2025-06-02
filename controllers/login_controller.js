
const Login_Model = require("../models/login_model");

class Login_Controller{
    carregar_pagina(req,resp){
        resp.render("home/login_view.ejs",{retorno:{ 
            usuario_erro: undefined,
            senha_erro: undefined,
            geral_erro: undefined,
            usuario: undefined,
            senha: undefined
        }});
    }

    async logar(req, resp){
        let usuario = req.body.txt_usuario;
        let senha = req.body.txt_senha;
        let msg = undefined;
        let msg_usuario = undefined;
        let msg_senha = undefined;

        if(usuario != "" && senha != ""){
            const login_M = new Login_Model();
            let login_encontrados = [];

            login_encontrados = await login_M.logar(usuario, senha);

            if (login_encontrados.length > 0) {
                resp.cookie("usuario_logado", login_encontrados[0].pessoa_cpf);
                switch (login_encontrados[0].perfil) {
                    case 3: // administrador;
                        resp.redirect("/admin/home");
                        break;
                    case 2: // professor; 
                        resp.redirect("/professor/home");
                        break;
                    case 1: // aluno;
                        resp.redirect("/aluno/home");
                        break;
                }
            } else{
                msg = "Usuario ou Senha invalidos";
            }
        } else {
            if(usuario == ""){
                msg_usuario = "Campo obrigatorio";
            }

            if(senha == ""){
                msg_senha = "Campo obrigatorio";
            }
        }
        
        resp.render("home/login_view.ejs", {
            retorno:{ 
                usuario_erro: msg_usuario,
                senha_erro: msg_senha,
                geral_erro: msg,
                usuario: usuario,
                senha: senha
            }
        });
        
    }
}

module.exports = Login_Controller;