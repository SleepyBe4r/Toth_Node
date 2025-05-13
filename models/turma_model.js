const Database = require("../utils/database");

class Turma_Model{

    #id;
    #turma;  

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get turma() {
        return this.#turma;
    }
    set turma(value) {
        this.#turma = value;
    }

    constructor(id, turma) {
        this.#id = id;
        this.#turma = turma;
    }

    async listar(){
        let SQL_text = `SELECT * FROM turmas `;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"],
                                       rows[i]["turma"]));
        }
        return lista;
    }

    async obter(id){
        let SQL_text = `SELECT * FROM turmas t
                        WHERE t.id_turma = ?`;
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"],
                                        rows[i]["turma"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO turmas (turma)
                        VALUES (?);`;
        let db = new Database();
        let valores = [this.#turma];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE turmas 
                        SET turma = ?
                        WHERE id_turma = ?;`;
        let db = new Database();
        let valores = [this.#turma, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM turmas WHERE id_turma = ?";
        let db = new Database();
        let valores = [this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }

    async listar_sem_grade_curricular(){ // arrumar
        let SQL_text = `SELECT t.id_turma, t.turma, s.serie, a.ano_letivo FROM turmas t
                        JOIN series s ON s.id_serie = t.id_serie
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo
                        WHERE NOT EXISTS
                            ( SELECT * FROM grade_curricular gc
                                WHERE gc.id_turma = t.id_turma )`;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"],
                                       rows[i]["turma"], 
                                       0, // id_serie
                                       rows[i]["serie"],
                                       0, // id_sala
                                       "", // sala         
                                       rows[i]["ano_letivo"]));
        }
        return lista;
    }

    async obterPorProf(id, cpf){ //arrumar
        let SQL_text = `SELECT pt.id_turma, t.turma, s.serie, a.ano_letivo FROM prof_turma pt
                        JOIN turmas t ON t.id_turma = pt.id_turma
                        JOIN series s ON s.id_serie = t.id_serie
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo
                        WHERE pt.cpf_professor = ? AND pt.id_disciplina = ?`;
        let db = new Database();
        let valores = [cpf, id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"], 
                                            rows[i]["turma"],
                                            0,
                                            rows[i]["serie"],
                                            0,
                                            rows[i]["ano_letivo"]));
        }
        return lista;
    }

}

module.exports = Turma_Model;