const Database = require("../utils/database");

class Sala_Model{
    
    #id;
    #sala;
    #capacidade_alunos;

    get id(){
        return this.#id;
    }

    set id(value){
        this.#id = value;
    }

    get sala(){
        return this.#sala;
    }

    set sala(value){
        this.#sala = value;
    }
    get capacidade_alunos(){
        return this.#capacidade_alunos;
    }

    set capacidade_alunos(value){
        this.#capacidade_alunos = value;
    }

    constructor(id, sala, capacidade_alunos){
        this.#id = id;
        this.#sala = sala;
        this.#capacidade_alunos = capacidade_alunos;
    }

    async listar(){
        let SQL_text = "SELECT * FROM salas";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Sala_Model(rows[i]["id_salas"], 
                                      rows[i]["nome"],
                                      rows[i]["capacidade_de_alunos"],));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO salas (nome, capacidade_de_alunos) 
                        VALUES (?, ?);`;
        let db = new Database();
        let valores = [this.#sala, this.#capacidade_alunos];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){
        let SQL_text = "SELECT * FROM salas WHERE id_salas = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Sala_Model(rows[i]["id_salas"], 
                                      rows[i]["nome"],
                                      rows[i]["capacidade_de_alunos"],));
        }
        return lista;
    }

    async atualizar(){
        let SQL_text = `UPDATE salas 
                        SET nome  = ?, capacidade_de_alunos = ?
                        WHERE id_salas = ?;`;
        let db = new Database();
        let valores = [this.#sala, this.#capacidade_alunos, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM salas WHERE id_salas = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Sala_Model;