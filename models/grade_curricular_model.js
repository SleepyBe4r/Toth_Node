const Database = require("../utils/database");

class grade_curricular_Model{

    #id;
    #id_turma;
    #id_disciplina;
    #cpf_professor;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get id_turma(){
        return this.#id_turma;
    }

    set id_turma(value){        
        this.#id_turma = value;
    }

    get id_disciplina(){
        return this.#id_disciplina;
    }

    set id_disciplina(value){        
        this.#id_disciplina = value;
    }

    get cpf_professor(){
        return this.#cpf_professor;
    }

    set cpf_professor(value){        
        this.#cpf_professor = value;
    }

    constructor(id, id_turma, id_disciplina, cpf_professor){
        this.#id = id;
        this.#id_turma = id_turma;
        this.#id_disciplina = id_disciplina;
        this.#cpf_professor = cpf_professor;
    }

    async listar(){
        let SQL_text = "SELECT * FROM grade_curricular";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new grade_curricular_Model(rows[i]["id"], 
                                                  rows[i]["id_turma"], 
                                                  rows[i]["id_disciplina"], 
                                                  rows[i]["cpf_professor"],));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO grade_curricular (id_turma, id_disciplina, cpf_professor) 
                        VALUES (?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_turma, this.#id_disciplina, this.#cpf_professor];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    // async obter(id){
    //     let SQL_text = "SELECT * FROM anos_letivos WHERE id_ano_letivo = ?";
    //     let db = new Database();
    //     let valores = [id];
    //     let lista = [];
    //     let rows = await db.ExecutaComando(SQL_text, valores);
    //     for(let i = 0; i < rows.length; i++){
    //         lista.push(new Ano_Letivo_Model(rows[i]["id_ano_letivo"], 
    //                                         rows[i]["ano_letivo"]));
    //     }
    //     return lista;
    // }

    // async atualizar(){
    //     let SQL_text = `UPDATE anos_letivos 
    //                     SET ano_letivo = ?
    //                     WHERE id_ano_letivo = ?;`;
    //     let db = new Database();
    //     let valores = [this.#ano_letivo, this.#id];        
    //     let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
    //     return resultado;
    // }

    // async excluir(){
    //     let SQL_text = "DELETE FROM anos_letivos WHERE id_ano_letivo = ?";
    //     let db = new Database();
    //     let valores = [this.#id];
    //     let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
    //     return resultado;
    // }
}

module.exports = grade_curricular_Model;