const Disciplina_Model = require("../models/disciplina_model");
const Disciplina_Serie_Model = require("../models/disciplina_serie_model");

class Disciplina_Serie_Controller{

    async obter_por_serie(req, resp) {
        
        let disc_serie_M = new Disciplina_Serie_Model();
        let lista_disc_serie = await disc_serie_M.listar_por_serie(req.params.id);

        let disciplina_M = new Disciplina_Model();
        let lista_disciplina = await disciplina_M.listar();

        let lista_completa = [];

        lista_disc_serie.forEach(item_disc_serie => {
            for (const item_disciplina of lista_disciplina) {
                if(item_disc_serie.id_disciplina == item_disciplina.id){
                    lista_completa.push({
                            id_disciplina : item_disciplina.id,
                            nome: item_disciplina.nome
                    });
                }
            }
        });

        if(lista_disc_serie.length == lista_completa.length){
            resp.send({
                ok : true,
                lista: lista_completa
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro na busca"
            })
        }
    }
}

module.exports = Disciplina_Serie_Controller;