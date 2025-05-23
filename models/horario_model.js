const Database = require("../utils/database");

class Horario_Model{

    #id_grade;
    #id_item;
    #dia_semana;
    #horario_inicio;
    #horario_fim;
    #periodo;

    get id_grade(){
        return this.#id_grade;
    }

    set id_grade(value){        
        this.#id_grade = value;
    }

    get id_item(){
        return this.#id_item;
    }

    set id_item(value){        
        this.#id_item = value;
    }

    get dia_semana(){
        return this.#dia_semana;
    }

    set dia_semana(value){        
        this.#dia_semana = value;
    }

    get horario_inicio(){
        return this.#horario_inicio;
    }

    set horario_inicio(value){        
        this.#horario_inicio = value;
    }

    get horario_fim(){
        return this.#horario_fim;
    }

    set horario_fim(value){        
        this.#horario_fim = value;
    }

    get periodo(){
        return this.#periodo;
    }

    set periodo(value){
        this.#periodo = value;
    }

    constructor(id_grade, id_item, dia_semana, horario_inicio, horario_fim, periodo){
        this.#id_grade = id_grade;
        this.#id_item = id_item;
        this.#dia_semana = dia_semana;
        this.#horario_inicio = horario_inicio;
        this.#horario_fim = horario_fim;
        this.#periodo = periodo;
    }

    async listar(){
        let SQL_text = "SELECT * FROM horarios";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Horario_Model(rows[i]["id_grade"],
                                         rows[i]["id_item"],
                                         rows[i]["dia_semana"],
                                         rows[i]["horario_inicio"], 
                                         rows[i]["horario_fim"],
                                         rows[i]["periodo"]));
        }
        return lista;
    }
    
    async obter(id_item, id_grade){
        let SQL_text = "SELECT * FROM horarios WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [id_item, id_grade];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Horario_Model(rows[i]["id_grade"],
                                         rows[i]["id_item"],
                                         rows[i]["dia_semana"],
                                         rows[i]["horario_inicio"], 
                                         rows[i]["horario_fim"],
                                         rows[i]["periodo"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO horarios (id_grade, id_item, dia_semana, horario_inicio, horario_fim, periodo)
                        VALUES (?, ?, ?, ?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_grade, this.#id_item, this.#dia_semana, this.#horario_inicio, this.#horario_fim, this.#periodo];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE horarios 
                        SET dia_semana  = ?, horario_inicio  = ?, horario_fim  = ?, periodo = ?
                        WHERE id_item = ? AND id_grade = ?;`;
        let db = new Database();
        let valores = [this.#dia_semana, this.#horario_inicio, this.#horario_fim, this.#id_item, this.#id_grade, this.#periodo];     
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM horarios WHERE id_item = ? AND id_grade = ?";
        let db = new Database();
        let valores = [this.#id_item, this.#id_grade];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Horario_Model;