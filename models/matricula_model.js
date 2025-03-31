const Database = require("../utils/database");

class Matricula_Model{

    #id;
    #cpf_aluno;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get cpf_aluno(){
        return this.#cpf_aluno;
    }

    set cpf_aluno(value){        
        this.#cpf_aluno = value;
    }

    constructor(id, cpf_aluno){
        this.#id = id;
        this.#cpf_aluno = cpf_aluno;
    }

    async listarPorTurma(id_turma){
        let SQL_text = "SELECT * FROM matriculas where id_turma = ?";
        let db = new Database();
        let valores = [id_turma];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Matricula_Model(rows[i]["id_matricula"], 
                                            rows[i]["cpf_aluno"]));
        }
        return lista;
    }

    async obterPorAluno(){
        let SQL_text = "SELECT * FROM matriculas where cpf_aluno = ?";
        let db = new Database();
        let valores = [this.#cpf_aluno];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Matricula_Model(rows[i]["id_matricula"], 
                                            rows[i]["cpf_aluno"]));
        }
        return lista;
    }
}

module.exports = Matricula_Model;