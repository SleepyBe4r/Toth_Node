const Database = require("../utils/database");

class Matricula_Model{

    #id_matricula;
    #data_matricula;
    #dt_trancamento;
    #cpf_aluno;
    #id_turma;
    #id_ano_letivo;
    #id_series;

    get id_matricula(){
        return this.#id_matricula;
    }

    set id_matricula(value){        
        this.#id_matricula = value;
    }

    get data_matricula(){
        return this.#data_matricula;
    }

    set data_matricula(value){        
        this.#data_matricula = value;
    }

    get dt_trancamento(){
        return this.#dt_trancamento;
    }

    set dt_trancamento(value){        
        this.#dt_trancamento = value;
    }

    get cpf_aluno(){
        return this.#cpf_aluno;
    }

    set cpf_aluno(value){        
        this.#cpf_aluno = value;
    }

    get id_turma(){
        return this.#id_turma;
    }

    set id_turma(value){        
        this.#id_turma = value;
    }

    get id_ano_letivo(){
        return this.#id_ano_letivo;
    }

    set id_ano_letivo(value){        
        this.#id_ano_letivo = value;
    }

    get id_series(){
        return this.#id_series;
    }

    set id_series(value){        
        this.#id_series = value;
    }

    constructor(id_matricula, data_matricula, dt_trancamento, cpf_aluno, id_turma, id_ano_letivo, id_series){
        this.#id_matricula = id_matricula;
        this.#data_matricula = data_matricula;
        this.#dt_trancamento = dt_trancamento;
        this.#cpf_aluno = cpf_aluno;
        this.#id_turma = id_turma;
        this.#id_ano_letivo = id_ano_letivo;
        this.#id_series = id_series;
    }

    async listar_por_turma(){
        let SQL_text = `SELECT * FROM matriculas 
                        WHERE id_turma = ? AND id_ano_letivo = ? AND id_series = ?`;
        let db = new Database();
        let valores = [this.#id_turma, this.#id_ano_letivo, this.#id_series];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Matricula_Model(rows[i]["id_matricula"], 
                                            rows[i]["data_matricula"],
                                            rows[i]["dt_trancamento"],
                                            rows[i]["cpf_aluno"],
                                            rows[i]["id_turma"],
                                            rows[i]["id_ano_letivo"],
                                            rows[i]["id_series"]));
        }
        return lista;
    }

    async obter_por_aluno(cpf_aluno){
        let SQL_text = "SELECT * FROM matriculas where cpf_aluno = ?";
        let db = new Database();
        let valores = [cpf_aluno];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Matricula_Model(rows[i]["id_matricula"], 
                                            rows[i]["data_matricula"],
                                            rows[i]["dt_trancamento"],
                                            rows[i]["cpf_aluno"],
                                            rows[i]["id_turma"],
                                            rows[i]["id_ano_letivo"],
                                            rows[i]["id_series"]));
        }
        return lista;
    }
}

module.exports = Matricula_Model;