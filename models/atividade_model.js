const Database = require("../utils/database");

class Atividade_Model{

    #id;
    #nome;  
    #descricao;  
    #peso;  
    #nota;  
    #feedback;  
    #dt_inicio;  
    #dt_final;  
    #txt_atividade_resposta;  
    #id_disciplina;  
    #disciplina;  
    #cpf_professor; 
    #professor; 
    #id_matricula;  
    #matricula;  
    #status;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#nome = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }

    get peso() {
        return this.#peso;
    }
    set peso(value) {
        this.#peso = value;
    }

    get nota() {
        return this.#nota;
    }
    set nota(value) {
        this.#nota = value;
    }

    get feedback() {
        return this.#feedback;
    }
    set feedback(value) {
        this.#feedback = value;
    }

    get dt_inicio() {
        return this.#dt_inicio;
    }
    set dt_inicio(value) {
        this.#dt_inicio = value;
    }

    get dt_final() {
        return this.#dt_final;
    }
    set dt_final(value) {
        this.#dt_final = value;
    }

    get txt_atividade_resposta() {
        return this.#txt_atividade_resposta;
    }
    set txt_atividade_resposta(value) {
        this.#txt_atividade_resposta = value;
    }

    get id_disciplina() {
        return this.#id_disciplina;
    }
    set id_disciplina(value) {
        this.#id_disciplina = value;
    }

    get disciplina() {
        return this.#disciplina;
    }
    set disciplina(value) {
        this.#disciplina = value;
    }

    get cpf_professor() {
        return this.#cpf_professor;
    }
    set cpf_professor(value) {
        this.#cpf_professor = value;
    }

    get professor() {
        return this.#professor;
    }
    set professor(value) {
        this.#professor = value;
    }

    get id_matricula() {
        return this.#id_matricula;
    }
    set id_matricula(value) {
        this.#id_matricula = value;
    }

    get matricula() {
        return this.#matricula;
    }
    set matricula(value) {
        this.#matricula = value;
    }

    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    constructor(id, nome, descricao, peso, nota, feedback, dt_inicio, dt_final,
                txt_atividade_resposta, id_disciplina, disciplina, cpf_professor,
                professor, id_matricula, matricula, status
    ) {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#peso = peso;
        this.#nota = nota;
        this.#feedback = feedback;
        this.#dt_inicio = dt_inicio;
        this.#dt_final = dt_final;
        this.#txt_atividade_resposta = txt_atividade_resposta;
        this.#id_disciplina = id_disciplina;
        this.#disciplina = disciplina;
        this.#cpf_professor = cpf_professor;
        this.#professor = professor;
        this.#id_matricula = id_matricula;
        this.#matricula = matricula;
        this.#status = status;
    }

    async listarPorProf(){
        let SQL_text = "SELECT * FROM atividades where cpf_professor = ?";
        let db = new Database();
        let valores = [this.#cpf_professor];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["idatividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            0, // peso
                                            0, // nota
                                            0, // feedback
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            "", // txt_atividade_resposta
                                            rows[i]["id_disciplina"],
                                            "", // disciplina
                                            "", //cpf_professor
                                            "", //professor
                                            rows[i]["id_matricula"],
                                            "", // matricula
                                            rows[i]["status"]));
        }
        return lista;
    }

    async listarPorAluno(){
        let SQL_text = "SELECT * FROM atividades where id_matricula = ?";
        let db = new Database();
        let valores = [this.#id_matricula];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["idatividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            0, // peso
                                            0, // nota
                                            0, // feedback
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            "", // txt_atividade_resposta
                                            rows[i]["id_disciplina"],
                                            "", // disciplina
                                            "", //cpf_professor
                                            "", //professor
                                            rows[i]["id_matricula"],
                                            "", // matricula
                                            rows[i]["status"]));
        }
        return lista;
    }

    async obter(){
        let SQL_text = "SELECT * FROM atividades where idatividades = ?";
        let db = new Database();
        let valores = [this.#id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["idatividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            rows[i]["peso"], // peso
                                            rows[i]["nota"], // nota
                                            0, // feedback
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            "", // txt_atividade_resposta
                                            rows[i]["id_disciplina"],
                                            "", // disciplina
                                            "", //cpf_professor
                                            "", //professor
                                            rows[i]["id_matricula"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO atividades 
                        (nome,descricao,peso,nota,dt_inicio,dt_final,id_disciplina,cpf_professor,id_matricula,status)
                        VALUES
                        (?,?,?,?,?,?,?,?,?,?);`;
        let db = new Database();
        let valores = [this.#nome, this.#descricao, this.#peso, this.#nota, this.#dt_inicio, this.#dt_final, this.#id_disciplina, this.#cpf_professor, this.#id_matricula, this.#status];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async responder(){
        let SQL_text = `UPDATE atividades 
                        SET txt_atividade_resposta = ?, status = ?
                        WHERE idatividades = ?`;
        let db = new Database();
        let valores = [this.#txt_atividade_resposta, this.#status, this.#id];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores)
        return resultado;
    }

    
}

module.exports = Atividade_Model;