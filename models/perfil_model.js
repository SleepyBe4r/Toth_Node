const Database = require("../utils/database");

class perfil_Model {
    #nome;
    #cpf;
    #email;
    #telefone;
    #rua;
    #bairro;
    #ano_letivo;
    #serie;
    #turma;
    #titulacao;

    constructor(nome, cpf, email, telefone, rua, bairro, ano_letivo, serie, turma, titulacao) {
        this.#nome = nome;
        this.#cpf = cpf;
        this.#email = email;
        this.#telefone = telefone;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#ano_letivo = ano_letivo;
        this.#serie = serie;
        this.#turma = turma;
        this.#titulacao = titulacao;

    }

    get nome() {
        return this.#nome;
    }

    set nome(value) {
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        this.#cpf = value;
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

    get titulacao() {
        return this.#titulacao;
    }

    set titulacao(value) {
        this.#titulacao = value;
    }

    async obterDadosAluno(cpf) {
        const sql = `
        SELECT p.nome, a.cpf_aluno, p.email, p.telefone, p.rua, p.bairro, an.ano_letivo, s.serie, t.turma
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
                rows[i]["nome"],
                rows[i]["cpf_aluno"],
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
        const sql = `
        SELECT p.nome, p.cpf, p.email, p.telefone, p.rua, p.bairro, pro.titulacao
        FROM professores pro
        INNER JOIN pessoas p ON p.cpf = pro.cpf_professor
        WHERE pro.cpf_professor = ?
    `;

        const db = new Database();
        const dados = [];
        const rows = await db.ExecutaComando(sql, [cpf]);

        for (let i = 0; i < rows.length; i++) {
            dados.push(new perfil_Model(
                rows[i]["nome"],
                rows[i]["cpf"],
                rows[i]["email"],
                rows[i]["telefone"],
                rows[i]["rua"],
                rows[i]["bairro"],
                null,
                null,
                null,
                rows[i]["titulacao"]
            ));
        }

        return dados;
    }

    async obterDadosAdmin(cpf) {
        const sql = `
        SELECT p.nome, p.cpf, p.email, p.telefone, p.rua, p.bairro
        FROM pessoas p
        WHERE p.cpf = ?
    `;

        const db = new Database();
        const rows = await db.ExecutaComando(sql, [cpf]);
        const dados = [];

        for (let i = 0; i < rows.length; i++) {
            dados.push(new perfil_Model(
                rows[i]["nome"],
                rows[i]["cpf"],
                rows[i]["email"],
                rows[i]["telefone"],
                rows[i]["rua"],
                rows[i]["bairro"],
                null,
                null,
                null,
                null
            ));
        }

        return dados;
    }
}

module.exports = perfil_Model;
