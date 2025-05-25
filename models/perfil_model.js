const Database = require("../utils/database");

class perfil_Model {
    #cpf;
    #nome;
    #email;
    #telefone;
    #rua;
    #bairro;
    #ano_letivo;
    #serie;
    #turma;

    constructor(cpf, nome, email, telefone, rua, bairro, ano_letivo, serie, turma) {
        this.#cpf = cpf;
        this.#nome = nome;
        this.#email = email;
        this.#telefone = telefone;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#ano_letivo = ano_letivo;
        this.#serie = serie;
        this.#turma = turma;


    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        this.#cpf = value;
    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#nome = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(value) {
        this.#telefone = value;
    }

    get rua() {
        return this.#rua;
    }

    set rua(value) {
        this.#rua = value;
    }

    get bairro() {
        return this.#bairro;
    }

    set bairro(value) {
        this.#bairro = value;
    }

     get ano_letivo() {
        return this.#ano_letivo;
    }

    set ano_letivo(value) {
        this.#ano_letivo = value;
    }

     get serie() {
        return this.#serie;
    }

    set serie(value) {
        this.#serie = value;
    }

    get turma() {
        return this.#turma;
    }

    set turma(value) {
        this.#turma = value;
    }

    async obterDadosAluno(cpf) {
        const sql = `
        SELECT a.cpf_aluno, p.nome, p.email, p.telefone, p.rua, p.bairro, an.ano_letivo, s.serie, t.turma
        FROM alunos a
        INNER JOIN pessoas p ON p.cpf = a.cpf_aluno
        INNER JOIN matriculas m ON m.cpf_aluno = a.cpf_aluno
        INNER JOIN anos_letivos an ON an.id_ano_letivo = m.id_ano_letivo
        INNER JOIN series s ON s.id_series = m.id_series
        INNER JOIN turmas t ON t.id_turma = m.id_turma
        WHERE a.cpf_aluno = ?
    `;

        const db = new Database();
        const dados = [];
        const rows = await db.ExecutaComando(sql, [cpf]);
        for (let i = 0; i < rows.length; i++) {
            dados.push(new perfil_Model(
                rows[i]["cpf_aluno"],
                rows[i]["nome"],
                rows[i]["email"],
                rows[i]["telefone"],
                rows[i]["rua"],
                rows[i]["bairro"],
                rows[i]["ano_letivo"],
                rows[i]["serie"],
                rows[i]["turma"]

            ));

        }

        return dados;
    }

    async obterDadosProfessor(cpf) {

       
    }

    async obterDadosAdmin(cpf) {
       
    }
}

module.exports = perfil_Model;
