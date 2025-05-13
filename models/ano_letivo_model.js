const Database = require("../utils/database");

class Ano_Letivo_Model{

    #id;
    #ano_letivo;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get ano_letivo(){
        return this.#ano_letivo;
    }

    set ano_letivo(value){        
        this.#ano_letivo = value;
    }

    constructor(id, ano_letivo){
        this.#id = id;
        this.#ano_letivo = ano_letivo;
    }

    async listar(){
        let SQL_text = "SELECT * FROM anos_letivos";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Ano_Letivo_Model(rows[i]["id_ano_letivo"], 
                                            rows[i]["ano_letivo"]));
        }
        return lista;
    }
    
    async obter(id){
        let SQL_text = "SELECT * FROM anos_letivos WHERE id_ano_letivo = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Ano_Letivo_Model(rows[i]["id_ano_letivo"], 
                                            rows[i]["ano_letivo"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO anos_letivos (ano_letivo) 
                        VALUES (?);`;
        let db = new Database();
        let valores = [this.#ano_letivo];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE anos_letivos 
                        SET ano_letivo = ?
                        WHERE id_ano_letivo = ?;`;
        let db = new Database();
        let valores = [this.#ano_letivo, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM anos_letivos WHERE id_ano_letivo = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Ano_Letivo_Model;