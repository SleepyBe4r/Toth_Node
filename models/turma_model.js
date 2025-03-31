const Database = require("../utils/database");

class Turma_Model{

    #id;
    #turma;  
    #id_serie;  
    #serie;  
    #id_salas; 
    #ano_letivo; 

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

    get id_serie() {
        return this.#id_serie;
    }
    set id_serie(value) {
        this.#id_serie = value;
    }

    get serie() {
        return this.#serie;
    }
    set serie(value) {
        this.#serie = value;
    }

    get id_salas() {
        return this.#id_salas;
    }
    set id_salas(value) {
        this.#id_salas = value;
    }

    get ano_letivo() {
        return this.#ano_letivo;
    }
    set ano_letivo(value) {
        this.#ano_letivo = value;
    }

    constructor(id, turma, id_serie, serie, id_salas, ano_letivo) {
        this.#id = id;
        this.#turma = turma;
        this.#id_serie = id_serie;
        this.#serie = serie;
        this.#id_salas = id_salas;
        this.#ano_letivo = ano_letivo;
    }

    async obterPorProf(id, cpf){
        let SQL_text = `SELECT pt.id_turma, t.turma, s.serie, a.ano_letivo FROM prof_turma pt
                        JOIN turmas t ON t.id_turma = pt.id_turma
                        JOIN series s ON s.id_series = t.id_serie
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