const Database = require("../utils/database");

class Quadro_Notas_Model{

    #id_quadro; 
    #cpf_professor;
    #id_turma;
    #id_series; 
    #id_ano_letivo;
    #bimestre;
    #id_disciplina;

    get id_quadro(){
        return this.#id_quadro;
    }

    set id_quadro(value){        
        this.#id_quadro = value;
    }

    get cpf_professor(){
        return this.#cpf_professor;
    }

    set cpf_professor(value){        
        this.#cpf_professor = value;
    }

    get id_turma(){
        return this.#id_turma;
    }

    set id_turma(value){        
        this.#id_turma = value;
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

    get bimestre(){
        return this.#bimestre;
    }

    set bimestre(value){        
        this.#bimestre = value;
    }

    get id_disciplina(){
        return this.#id_disciplina;
    }

    set id_disciplina(value){
        this.#id_disciplina = value;
    }

    constructor(id_quadro, cpf_professor, id_turma, id_series, id_ano_letivo, bimestre, id_disciplina){
        this.#id_quadro = id_quadro;
        this.#cpf_professor = cpf_professor;
        this.#id_turma = id_turma;
        this.#id_series = id_series; 
        this.#id_ano_letivo = id_ano_letivo;
        this.#bimestre = bimestre;
        this.#id_disciplina = id_disciplina;
    }

    async listar(){
        let SQL_text = "SELECT * FROM quadro_notas";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Quadro_Notas_Model(rows[i]["id_quadro"],
                                              rows[i]["cpf_professor"],
                                              rows[i]["id_turma"],
                                              rows[i]["id_series"],
                                              rows[i]["id_ano_letivo"],
                                              rows[i]["bimestre"],
                                              rows[i]["id_disciplina"]));
        }
        return lista;
    }
    
    async obter(id_quadro){
        let SQL_text = "SELECT * FROM quadro_notas WHERE id_quadro = ?";
        let db = new Database();
        let valores = [id_quadro];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Quadro_Notas_Model(rows[i]["id_quadro"],
                                              rows[i]["cpf_professor"],
                                              rows[i]["id_turma"],
                                              rows[i]["id_series"],
                                              rows[i]["id_ano_letivo"],
                                              rows[i]["bimestre"],
                                              rows[i]["id_disciplina"]));
        }
        return lista;
    }

    async obter_ultimo_id() {
        let SQL_text = "SELECT id_quadro FROM quadro_notas ORDER BY id_quadro DESC LIMIT 1;";
        let db = new Database();
        let rows = await db.ExecutaComando(SQL_text);
        let id = rows[0]["id_quadro"];
        
        return id;
    }

    async inserir(){
        let SQL_text = `INSERT INTO quadro_notas (cpf_professor, id_turma, id_series, id_ano_letivo, bimestre, id_disciplina) 
                        VALUES (?, ?, ?, ?, ?, ?);`;
        let db = new Database();
        let valores = [this.#cpf_professor, this.#id_turma, this.#id_series, this.#id_ano_letivo, this.#bimestre, this.#id_disciplina];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE quadro_notas 
                        SET cpf_professor = ?, id_turma = ?, id_series = ?, id_ano_letivo = ?, bimestre = ?, id_disciplina = ?
                        WHERE id_quadro = ?;`;
        let db = new Database();
        let valores = [this.#cpf_professor, this.#id_turma, this.#id_series, this.#id_ano_letivo, this.#bimestre, this.#id_quadro, this.#id_disciplina];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM quadro_notas WHERE id_quadro = ?";
        let db = new Database();
        let valores = [this.#id_quadro];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Quadro_Notas_Model;