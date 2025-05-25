const Database = require("../utils/database");

class Disciplina_grade_Model{

    #id_item;
    #id_grade;
    #id_disciplina;

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

    get id_disciplina(){
        return this.#id_disciplina;
    }

    set id_disciplina(value){        
        this.#id_disciplina = value;
    }

    constructor(id_item, id_grade, id_disciplina){
        this.#id_item = id_item;
        this.#id_grade = id_grade;
        this.#id_disciplina = id_disciplina;
    }

    async listar(){
        let SQL_text = "SELECT * FROM disciplina_grade";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_grade_Model(rows[i]["id_item"],
                                                  rows[i]["id_grade"], 
                                                  rows[i]["id_disciplina"]));
        }
        return lista;
    }
    
    async obter(id_item, id_grade){
        let SQL_text = "SELECT * FROM disciplina_grade WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [id_item, id_grade];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_grade_Model(rows[i]["id_item"],
                                                  rows[i]["id_grade"], 
                                                  rows[i]["id_disciplina"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO disciplina_grade (id_item, id_grade, id_disciplina) 
                        VALUES (?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade, this.#id_disciplina];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE disciplina_grade 
                        SET id_disciplina = ?
                        WHERE id_item = ? AND id_grade = ?;`;
        let db = new Database();
        let valores = [this.#id_disciplina, this.#id_item, this.#id_grade];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM disciplina_grade WHERE id_item = ? AND id_grade = ? AND id_disciplina = ?";
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade, this.#id_disciplina];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Disciplina_grade_Model;