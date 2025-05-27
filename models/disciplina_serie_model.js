const Database = require("../utils/database");

class Disciplina_Serie_Model{

    #id_series;
    #id_disciplina;

    get id_series(){
        return this.#id_series;
    }

    set id_series(value){        
        this.#id_series = value;
    }

    get id_disciplina(){
        return this.#id_disciplina;
    }

    set id_disciplina(value){        
        this.#id_disciplina = value;
    }

    constructor(id_series, id_disciplina){
        this.#id_series = id_series;
        this.#id_disciplina = id_disciplina;
    }

    async listar(){
        let SQL_text = "SELECT * FROM disciplina_serie";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Serie_Model(rows[i]["id_series"],
                                                  rows[i]["id_disciplina"]));
        }
        return lista;
    }

    async listar_por_serie(id_series){
        let SQL_text = "SELECT * FROM disciplina_serie where id_series = ?";
        let db = new Database();
        let valores = [id_series]
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Serie_Model(rows[i]["id_series"],
                                                  rows[i]["id_disciplina"]));
        }
        return lista;
    }
    
    async obter(id_series, id_disciplina){
        let SQL_text = "SELECT * FROM disciplina_serie WHERE id_series = ? AND id_disciplina = ?";
        let db = new Database();
        let valores = [id_series, id_disciplina];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Serie_Model(rows[i]["id_series"],
                                                  rows[i]["id_disciplina"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO disciplina_serie (id_series, id_disciplina) 
                        VALUES (?, ?);`;
        let db = new Database();
        let valores = [this.#id_series, this.#id_disciplina];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM disciplina_serie WHERE id_series = ? AND id_disciplina = ?";
        let db = new Database();
        let valores = [this.#id_series, this.#id_disciplina];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Disciplina_Serie_Model;