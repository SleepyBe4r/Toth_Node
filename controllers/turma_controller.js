const Turma_Model = require("../models/turma_model");

class Turma_Controller{

    async ObterPorDisc(req, resp){
        let cpf = req.cookies.usuario_Logado;
        let id = req.body.id_disciplina;
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.obterPorProf(id, cpf);
        let lista = [];
        lista_turmas.forEach(e=>{
            lista.push({
                id: e["id"],
                nome: `${e["serie"]} - ${e["turma"]} - ${e["ano_letivo"]}`
            });
        })
        
        resp.send({
            ok : true,
            lista: lista 
        })
    }
    
}

module.exports = Turma_Controller;