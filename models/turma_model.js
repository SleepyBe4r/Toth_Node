const Database = require("../utils/database");

class Turma_Model{

    #id;
    #turma;  
    #id_serie;  
    #serie;  
    #id_sala; 
    #sala; 
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

    get id_sala() {
        return this.#id_sala;
    }
    set id_sala(value) {
        this.#id_sala = value;
    }

    get ano_letivo() {
        return this.#ano_letivo;
    }
    set ano_letivo(value) {
        this.#ano_letivo = value;
    }

    get sala() {
        return this.#sala;
    }
    set sala(value) {
        this.#sala = value;
    }

    constructor(id, turma, id_serie, serie, id_sala, sala = "não alocada", ano_letivo) {
        this.#id = id;
        this.#turma = turma;
        this.#id_serie = id_serie;
        this.#serie = serie;
        this.#id_sala = id_sala;
        if (sala == null) this.#sala  = "não alocada";
        else this.#sala = sala;
        this.#ano_letivo = ano_letivo;
    }

    async listar(){
        let SQL_text = `SELECT t.id_turma, t.turma, s.serie, a.ano_letivo, sl.nome as sala FROM turmas t
                        LEFT JOIN salas sl ON sl.id_salas = t.id_salas
                        JOIN series s ON s.id_series = t.id_serie
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo`;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"],
                                       rows[i]["turma"], 
                                       0, // id_serie
                                       rows[i]["serie"],
                                       0, // id_sala
                                       rows[i]["sala"],         
                                       rows[i]["ano_letivo"]));
        }
        return lista;
    }

    async listarSemGradeCurricular(){
        let SQL_text = `SELECT t.id_turma, t.turma, s.serie, a.ano_letivo FROM turmas t
                        JOIN series s ON s.id_series = t.id_serie
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo
                        WHERE NOT EXISTS
                            ( SELECT * FROM discturmas_horarios dtc
                                WHERE dtc.id_turma = t.id_turma )`;
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

    async inserir(){
        let SQL_text = `INSERT INTO turmas (turma, id_serie)
                        VALUES (?, ?);`;
        let db = new Database();
        let valores = [this.#turma, this.#id_serie];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){
        let SQL_text = `SELECT t.id_turma, t.turma, t.id_serie, s.serie, a.ano_letivo, sl.nome as sala FROM turmas t
                        LEFT JOIN salas sl ON sl.id_salas = t.id_salas
                        JOIN series s ON s.id_series = t.id_serie
                        JOIN anos_letivos a ON a.id_ano_letivo = s.id_ano_letivo
                        WHERE t.id_turma = ?`;
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Turma_Model(rows[i]["id_turma"],
                                        rows[i]["turma"], 
                                        rows[i]["id_serie"],
                                        rows[i]["serie"],
                                        0, // id_sala
                                        rows[i]["sala"],         
                                        rows[i]["ano_letivo"]));
        }
        return lista;
    }

    async atualizar(){
        let SQL_text = `UPDATE turmas 
                        SET turma = ?, id_serie = ?
                        WHERE id_turma = ?;`;
        let db = new Database();
        let valores = [this.#turma, this.#id_serie, this.#id];        
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

}

module.exports = Turma_Model;