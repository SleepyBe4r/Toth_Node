const Database = require("../utils/database");

class PessoaModel{
    #cpf;
    #nome;
    #data;
    #email;
    #fone;
    #rua;
    #bairro;


    get cpf(){
        return this.#cpf;
    }
    set cpf(value){
        this.#cpf = value;
    }

    get nome(){
        return this.#nome;
    }
    set nome(value){
        this.#nome = value;
    }

    get data(){
        return this.#data;
    }
    set data(value){
        this.#data = value;
    }

    get email(){
        return this.#email;
    }
    set email(value){
        this.#email = value;
    }

    get fone(){
        return this.#fone;
    }
    set fone(value){
        this.#fone = value;
    }

    get rua(){
        return this.#rua;
    }
    set rua(value){
        this.#rua = value;
    }

    get bairro(){
        return this.#bairro;
    }
    set bairro(value){
        this.#bairro = value;
    }

    constructor (cpf, nome, data, email, fone, rua, bairro){
        this.#cpf = cpf;
        this.#nome = nome;
        this.#data = data;
        this.#email = email;
        this.#fone = fone;
        this.#rua = rua;
        this.#bairro =bairro;
    }

    async listar() {
        let SQL_text = "SELECT * FROM pessoas";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        
        for (let i = 0; i < rows.length; i++) {
            lista.push(new PessoaModel(
                rows[i]["cpf"],
                rows[i]["nome"],
                rows[i]["dt_nascimento"],
                rows[i]["email"],
                rows[i]["telefone"],
                rows[i]["rua"],
                rows[i]["bairro"],
            ));
        }
        return lista;
    }

    async obter(cpf) {
        let SQL_text = "SELECT * FROM pessoas WHERE cpf = ?";
        let db = new Database();
        let valores = [cpf];
        let rows = await db.ExecutaComando(SQL_text, valores);
        
        if (rows.length > 0) {
            return {
                cpf: rows[0]["cpf"],
                nome: rows[0]["nome"],
                data: rows[0]["dt_nascimento"],
                email: rows[0]["email"],
                fone: rows[0]["telefone"],
                rua: rows[0]["rua"],
                bairro: rows[0]["bairro"]
            };
        }
        return null;
    }

    async inserir(){
        let sql = `INSERT INTO pessoas (cpf, nome, dt_nascimento, rua, bairro, email, telefone)
                   values (?, ?, ?, ?, ?, ?, ?)`;
        
        let db = new Database();
        let valores = [this.#cpf, this.#nome, this.#data, this.#rua, this.#bairro, this.#email, this.#fone];
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async atualizar(){
        let sql = `UPDATE pessoas 
                   SET nome = ?, dt_nascimento = ?, rua = ?, bairro = ?, email = ?, telefone = ?
                   WHERE cpf = ?`;
        
        let db = new Database();
        let valores = [this.#nome, this.#data, this.#rua, this.#bairro, this.#email, this.#fone, this.#cpf];
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(){
        let sql = "DELETE FROM pessoas WHERE cpf = ?";
        let db = new Database();
        let valores = [this.#cpf];
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = PessoaModel;