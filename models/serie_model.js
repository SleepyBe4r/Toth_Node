const Database = require("../utils/database");

class Serie_Model{

    #id;
    #serie;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get serie(){
        return this.#serie;
    }

    set serie(value){        
        this.#serie = value;
    }

    constructor(id, serie){
        this.#id = id;
        this.#serie = serie;
    }

    async listar(){
        let SQL_text = `SELECT * FROM series`;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Serie_Model(rows[i]["id_series"], 
                                       rows[i]["serie"]));
        }
        return lista;
    }

    async obter(id){
        let SQL_text = "SELECT * FROM series WHERE id_series = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Serie_Model(rows[i]["id_series"],
                                            rows[i]["serie"]));
        }
        return lista;
    }

    async selecionar_ultimo_id(){             
        let SQL_text = "SELECT id_series FROM series ORDER BY id_series DESC LIMIT 1";
        let db = new Database();
        let id;
        let rows = await db.ExecutaComando(SQL_text);
        id = rows[0]["id_series"];


        return id;
    }
    
    async inserir(){
        let SQL_text = `INSERT INTO series (serie) 
                        VALUES (?);`;
        let db = new Database();
        let valores = [this.#serie];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE series 
                        SET serie = ?
                        WHERE id_series = ?;`;
        let db = new Database();
        let valores = [this.#serie, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM series WHERE id_series = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Serie_Model;