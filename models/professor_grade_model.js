const Database = require("../utils/database");

class Professor_Grade_Model{

    #id_item;
    #id_grade;
    #cpf_professor;

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

    get cpf_professor(){
        return this.#cpf_professor;
    }

    set cpf_professor(value){        
        this.#cpf_professor = value;
    }

    constructor(id_item, id_grade, cpf_professor){
        this.#id_item = id_item;
        this.#id_grade = id_grade;
        this.#cpf_professor = cpf_professor;
    }

    async listar(){
        let SQL_text = "SELECT * FROM professor_grade";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Professor_Grade_Model(rows[i]["id_item"],
                                                  rows[i]["id_grade"], 
                                                  rows[i]["cpf_professor"]));
        }
        return lista;
    }
    
    async obter(id_item, id_grade){
        let SQL_text = "SELECT * FROM professor_grade WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [id_item, id_grade];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Professor_Grade_Model(rows[i]["id_item"],
                                                  rows[i]["id_grade"], 
                                                  rows[i]["cpf_professor"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO professor_grade (id_item, id_grade, cpf_professor) 
                        VALUES (?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade, this.#cpf_professor];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE professor_grade 
                        SET cpf_professor = ?
                        WHERE id_item = ? AND id_grade = ?;`;
        let db = new Database();
        let valores = [this.#cpf_professor, this.#id_item, this.#id_grade];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM professor_grade WHERE id_item = ? AND id_grade = ? AND cpf_professor = ?";
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade, this.#cpf_professor];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Professor_Grade_Model;