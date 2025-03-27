const Database = require("../utils/database");

class AlunoModel{
    #cpf;
    #convenio;

    get cpf(){
        return this.#cpf;
    }
    set cpf(value){
        this.#cpf = value;
    }

    get convenio(){
        return this.#convenio;
    }
    set convenio(value){
        this.#convenio = value;
    }

    constructor (cpf, convenio){
        this.#cpf = cpf;
        this.#convenio = convenio;
    }

    async listar(){
        let sql = "select * from alunos";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(sql);
        for(let i = 0; i < rows.length; i++){
            lista.push(new AlunoModel(rows[i]["cpf_aluno"],
                                      rows[i]["convenio"]));
        }
        return lista;
    }

    async inserir(){
        let sql = `INSERT INTO alunos (cpf_aluno, convenio)
                   values (?, ?)`;
        
        let db = new Database();
        let valores = [this.#cpf, this.#convenio];
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = AlunoModel;