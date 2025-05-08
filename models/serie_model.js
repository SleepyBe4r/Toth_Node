const Database = require("../utils/database");

class Serie_Model{

    #id;
    #serie;
    #id_ano_letivo;
    #ano_letivo;

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

    get id_ano_letivo(){
        return this.#id_ano_letivo;
    }

    set id_ano_letivo(value){        
        this.#id_ano_letivo = value;
    }

    get ano_letivo(){
        return this.#ano_letivo;
    }

    set ano_letivo(value){        
        this.#ano_letivo = value;
    }

    constructor(id, serie, id_ano_letivo, ano_letivo){
        this.#id = id;
        this.#serie = serie;
        this.#id_ano_letivo = id_ano_letivo;
        this.#ano_letivo = ano_letivo;
    }

    async listar(){
        let SQL_text = `SELECT s.id_serie, s.serie, s.id_ano_letivo, a.ano_letivo FROM series s
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo`;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Serie_Model(rows[i]["id_serie"], 
                                        rows[i]["serie"],
                                        rows[i]["id_ano_letivo"],
                                        rows[i]["ano_letivo"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO series (serie, id_ano_letivo) 
                        VALUES (?, ?);`;
        let db = new Database();
        let valores = [this.#serie, this.#id_ano_letivo];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){
        let SQL_text = "SELECT * FROM series WHERE id_series = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Serie_Model(rows[i]["id_series"],
                                            rows[i]["serie"], 
                                            rows[i]["id_ano_letivo"]));
        }
        return lista;
    }

    async atualizar(){
        let SQL_text = `UPDATE series 
                        SET serie = ?, id_ano_letivo = ?
                        WHERE id_series = ?;`;
        let db = new Database();
        let valores = [this.#serie, this.#id_ano_letivo, this.#id];        
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