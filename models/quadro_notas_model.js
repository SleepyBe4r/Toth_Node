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

    async listar(ano, serie, turma, bimestre, cpf_professor, disciplina){
        //preparar o where para filtrar o sql
        let whereFiltro = "";
        let valores = [];
        if(ano && ano != "") {                        
            whereFiltro += " WHERE id_ano_letivo = ? ";            
            valores.push(ano);
        }

        if(serie && serie != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE id_series = ? ";       
                valores.push(serie);
            } else {
                whereFiltro += "AND id_series = ? ";       
                valores.push(serie);
            }
        }

        if(turma && turma != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE id_turma = ? ";            
                valores.push(turma);
            } else {
                whereFiltro += " AND id_turma = ? ";            
                valores.push(turma);
            }
        }

        if(bimestre && bimestre != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE bimestre = ? ";
                valores.push(bimestre);
            } else {
                whereFiltro += " AND bimestre = ? ";
                valores.push(bimestre);
            }
        }

        if(cpf_professor && cpf_professor != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE cpf_professor = ? ";
                valores.push(cpf_professor);
            } else {
                whereFiltro += " AND cpf_professor = ? ";
                valores.push(cpf_professor);
            }
        }

        if(disciplina && disciplina != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE id_disciplina = ? ";
                valores.push(disciplina);
            } else {
                whereFiltro += " AND id_disciplina = ? ";
                valores.push(disciplina);
            }
        }


        let SQL_text = `SELECT * FROM quadro_notas ${whereFiltro}`; 
        let db = new Database();
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
        let valores = [this.#cpf_professor, this.#id_turma, this.#id_series, this.#id_ano_letivo, this.#bimestre, this.#id_disciplina, this.#id_quadro];        
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
    
    toJSON() {
        return {
            id_quadro: this.#id_quadro,
            cpf_professor: this.#cpf_professor,
            id_turma: this.#id_turma,
            id_series: this.#id_series,
            id_ano_letivo: this.#id_ano_letivo,
            bimestre: this.#bimestre,
            id_disciplina: this.#id_disciplina
        }
    }
}

module.exports = Quadro_Notas_Model;