const Serie_Model = require("../models/serie_model");
const Disciplina_Model = require("../models/disciplina_model");
const Disciplina_Serie_Model = require("../models/disciplina_serie_model");

class Serie_Controller{

    async listar_view(req, resp){
        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();
        resp.render("serie/listar_serie.ejs", { layout: "layout_admin_home.ejs", lista_series});
    }

    async listar_cadastro(req, resp){
        let serie_para_alterar  = undefined;
        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();
        resp.render("serie/cadastrar_view.ejs", { layout: "layout_admin_home.ejs", serie_para_alterar, lista_disciplinas });
    }

    async cadastrar_serie(req, resp) {
        if(req.body.serie == "" && req.body.disciplinas.length == 0){
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
        let ultimo_id = await serie_M.selecionar_ultimo_id();

        let lista_disc_serie = [];

        for (let item_disc of req.body.disciplinas) {
            let disc_serie_M = new Disciplina_Serie_Model();
            disc_serie_M.id_disciplina = item_disc.disciplina;
            disc_serie_M.id_series = ultimo_id;
            let resultado_disc_serie = await disc_serie_M.inserir();
            if(resultado_disc_serie) lista_disc_serie.push(resultado_disc_serie);
        }

        if(lista_serie && req.body.disciplinas.length == lista_disc_serie.length){
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

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let disc_serie_M = new Disciplina_Serie_Model();
        let lista_disciplina_serie = await disc_serie_M.listar_por_serie(id);

        resp.render("serie/cadastrar_view.ejs", { 
            layout: "layout_admin_home.ejs", 
            serie_para_alterar, 
            lista_disciplinas,
            lista_disciplina_serie
        });
    }

    async editar_serie(req, resp) {
        if(req.body.serie == "" && req.body.disciplinas.length == 0){
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let serie_M = new Serie_Model();
        serie_M.id =  req.body.id_serie;
        serie_M.serie = req.body.serie;

        let lista_serie = [];

        lista_serie = await serie_M.atualizar();

        let lista_disc_serie = [];
        let disc_serie_M = new Disciplina_Serie_Model();
        let lista_disc_serie_old = await disc_serie_M.listar_por_serie(req.body.id_serie);

        if(lista_serie){
            for (let item_disc of req.body.disciplinas) {

                let achou = false;
                lista_disc_serie_old.forEach((ds_old, index) => {
                    for (const disciplina of req.body.disciplinas) {
                        if (ds_old.id_series == req.body.id_serie &&
                            ds_old.id_disciplina == disciplina.disciplina
                        ) {
                            achou = true;
                            lista_disc_serie_old.splice(index, 1); 
                        }                        
                    }
                });

                if (!achou) {
                    let disc_serie_M = new Disciplina_Serie_Model();
                    disc_serie_M.id_disciplina = item_disc.disciplina;
                    disc_serie_M.id_series = req.body.id_serie;                
                    let resultado_disc_serie = await disc_serie_M.inserir();
                    if(resultado_disc_serie) lista_disc_serie.push(resultado_disc_serie);
                } else{
                    lista_disc_serie.push("ok");
                }
            }
        }

        lista_disc_serie_old.forEach(async (ds_old, index) => {
            let disc_serie_exclusao_M = new Disciplina_Serie_Model();
            disc_serie_exclusao_M.id_series = req.body.id_serie;
            disc_serie_exclusao_M.id_disciplina = ds_old.id_disciplina;
                    
            if(await disc_serie_exclusao_M.excluir()) lista_disc_serie_old.splice(index, 1);  
        });

        if(req.body.disciplinas.length == lista_disc_serie.length){
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