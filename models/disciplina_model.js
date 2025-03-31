const Database = require("../utils/database");

class Disciplina_Model{

    #id;
    #nome;
    #carga_horaria;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get nome(){
        return this.#nome;
    }

    set nome(value){
        this.#nome = value;
    }

    get carga_horaria(){
        return this.#carga_horaria;
    }

    set carga_horaria(value){        
        this.#carga_horaria = value;
    }

    constructor(id, nome, carga_horaria){
        this.#id = id;
        this.#nome = nome;
        this.#carga_horaria = carga_horaria;
    }

    async listar(){
        let SQL_text = "SELECT * FROM disciplinas";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Model(rows[i]["id_disciplina"], 
                                            rows[i]["nome"],
                                            rows[i]["carga_horaria"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO disciplinas (nome, carga_horaria) 
                        VALUES (?, ?);`;
        let db = new Database();
        let valores = [this.#nome, this.#carga_horaria];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){
        let SQL_text = "SELECT * FROM disciplinas WHERE id_disciplina = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Model(rows[i]["id_disciplina"], 
                                            rows[i]["nome"],
                                            rows[i]["carga_horaria"]));
        }
        return lista;
    }

    async obter_Disc_Prof(cpf_professor){
        let SQL_text = `SELECT * FROM prof_turma pt
                        JOIN disciplinas d ON d.id_disciplina = pt.id_disciplina
                        WHERE cpf_professor = ?`;

        let db = new Database();
        let valores = [cpf_professor];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Disciplina_Model(rows[i]["id_disciplina"],
                                            rows[i]["nome"]));
        }
        return lista;
    }

    async atualizar(){
        let SQL_text = `UPDATE disciplinas 
                        SET nome = ?, carga_horaria = ?
                        WHERE id_disciplina = ?;`;
        let db = new Database();
        let valores = [this.#nome, this.#carga_horaria, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM disciplinas WHERE id_disciplina = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Disciplina_Model;