const Database = require("../utils/database");

class Item_Grade_Model{

    #id_item;
    #id_grade;

    get id_item(){
        return this.#id_item;
    }

    set id_item(value){        
        this.#id_item = value;
    }

    get id_grade(){
        return this.#id_grade;
    }

    set id_grade(value){        
        this.#id_grade = value;
    }

    constructor(id_item, id_grade){
        this.#id_item = id_item;
        this.#id_grade = id_grade;
    }

    async listar(){
        let SQL_text = "SELECT * FROM item_grade";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Item_Grade_Model(rows[i]["id_item"], 
                                            rows[i]["id_grade"]));
        }
        return lista;
    }

    async listar_por_grade(){
        let SQL_text = "SELECT * FROM item_grade WHERE id_grade = ?";
        let db = new Database();
        let valores = [this.#id_grade];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Item_Grade_Model(rows[i]["id_item"], 
                                            rows[i]["id_grade"]));
        }
        return lista;
    }
    
    async selecionar_ultimo_id(){             
        let SQL_text = "SELECT id_item FROM item_grade ORDER BY id_item DESC LIMIT 1";
        let db = new Database();
        let id;
        let rows = await db.ExecutaComando(SQL_text);
        id = rows[0]["id_item"];

        return id;
    }
    
    async obter(id_item, id_grade){
        let SQL_text = "SELECT * FROM item_grade WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [id_item, id_grade];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Item_Grade_Model(rows[i]["id_item"], 
                                            rows[i]["id_grade"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO item_grade (id_grade) 
                        VALUES (?);`;
        let db = new Database();
        let valores = [this.#id_grade];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM item_grade WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Item_Grade_Model;