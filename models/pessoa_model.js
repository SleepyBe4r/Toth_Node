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

    async inserir(){
        let sql = `INSERT INTO pessoas (cpf, nome, dt_nascimento, rua, bairro, email, telefone)
                   values (?, ?, ?, ?, ?, ?, ?)`;
        
        let db = new Database();
        let valores = [this.#cpf, this.#nome, this.#data, this.#rua, this.#bairro, this.#email, this.#fone];
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }



}

module.exports = PessoaModel;