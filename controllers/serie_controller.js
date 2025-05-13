const Serie_Model = require("../models/serie_model");

class Serie_Controller{

    async listar_view(req, resp){
        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();
        resp.render("serie/listar_serie.ejs", { layout: "layout_admin_home.ejs", lista_series});
    }

    async listar_cadastro(req, resp){
        let serie_para_alterar  = undefined;
        resp.render("serie/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", serie_para_alterar});
    }

    async cadastrar_serie(req, resp) {
        if(req.body.serie == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let serie_M = new Serie_Model();
        serie_M.serie = req.body.serie;

        let lista_serie = [];

        lista_serie = await serie_M.inserir();
        if(lista_serie){
            resp.send({
                ok : true,
                msg: "Série cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir a Série"
            })
        }
    }
    
    async excluir_serie(req, resp){
        let serie_M = new Serie_Model();
        serie_M.id = req.body.id;

        let lista_serie = await serie_M.excluir();
        if(lista_serie){
            resp.send({
                ok : true
            })
        } else{            
            resp.send({
                ok : false
            })
        }
    }

    async listar_editar(req, resp){
        const id = req.params.id;
        let serie_M = new Serie_Model();
        let serie_para_alterar = await serie_M.obter(id);
        serie_para_alterar = serie_para_alterar[0];

        resp.render("serie/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", serie_para_alterar});
    }

    async editar_serie(req, resp) {
        if(req.body.serie == ""){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let serie_M = new Serie_Model();
        serie_M.id =  req.body.id;
        serie_M.serie = req.body.serie;

        let lista_serie = [];

        lista_serie = await serie_M.atualizar();
        if(lista_serie){
            resp.send({
                ok : true,
                msg: "Série editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Série"
            })
        }
    }
}

module.exports = Serie_Controller;