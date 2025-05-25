const Database = require("../utils/database");

class grade_Model{

    #id;
    #id_salas;
    #id_series;
    #id_ano_letivo;
    #id_turma;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get id_salas(){
        return this.#id_salas;
    }

    set id_salas(value){        
        this.#id_salas = value;
    }

    get id_series(){
        return this.#id_series;
    }

    set id_series(value){        
        this.#id_series = value;
    }

    get id_ano_letivo(){
        return this.#id_ano_letivo;
    }

    set id_ano_letivo(value){        
        this.#id_ano_letivo = value;
    }

    get id_turma(){
        return this.#id_turma;
    }

    set id_turma(value){        
        this.#id_turma = value;
    }

    constructor(id, id_salas, id_series, id_ano_letivo, id_turma){
        this.#id = id;
        this.#id_salas = id_salas;
        this.#id_series = id_series;
        this.#id_ano_letivo = id_ano_letivo;
        this.#id_turma = id_turma;
    }

    async listar(){
        let SQL_text = "SELECT * FROM grade";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new grade_Model(rows[i]["id_grade"], 
                                       rows[i]["id_salas"], 
                                       rows[i]["id_series"], 
                                       rows[i]["id_ano_letivo"], 
                                       rows[i]["id_turma"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO grade (id_series, id_salas, id_ano_letivo, id_turma) 
                        VALUES (?, ?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_series, this.#id_salas, this.#id_ano_letivo, this.#id_turma];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){             
        let SQL_text = "SELECT * FROM grade WHERE id_grade = ?";
        let db = new Database();
        let valores = [id];
        let rows = await db.ExecutaComando(SQL_text, valores);
        
        let grade = {
            id: rows[0]["id_grade"],
            id_salas: rows[0]["id_salas"],
            id_series: rows[0]["id_series"],
            id_ano_letivo: rows[0]["id_ano_letivo"],
            id_turma: rows[0]["id_turma"]
        }

        return grade;
    }

    
    async selecionar_ultimo_id(){             
        let SQL_text = "SELECT id_grade FROM grade ORDER BY id_grade DESC LIMIT 1";
        let db = new Database();
        let id;
        let rows = await db.ExecutaComando(SQL_text);
        id = rows[0]["id_grade"];


        return id;
    }

    async atualizar(){
        let SQL_text = `UPDATE grade 
                        SET id_series = ?, id_ano_letivo = ?, id_turma = ?, id_salas = ? 
                        WHERE id_grade = ?;`;
        let db = new Database();
        let valores = [this.#id_series, this.#id_ano_letivo, this.#id_turma, this.#id_salas, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM grade WHERE id_grade = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = grade_Model;