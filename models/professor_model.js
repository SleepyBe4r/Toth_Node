const Database = require("../utils/database");

class Professor_Model {
  
    #cpf;
    #titulacao;
    #dataAdmissao;


    get cpf() {
        return this.#cpf;
    }

    set cpf(value) {
        this.#cpf = value;
    }

    get titulacao() {
        return this.#titulacao;
    }

    set titulacao(value) {
        this.#titulacao = value;
    }

    get dataAdmissao() {
        return this.#dataAdmissao;
    }

    set dataAdmissao(value) {
        this.#dataAdmissao = value;
    }


    constructor(
        cpf = null,
        titulacao = null,
        dataAdmissao = null
    ) 
    
    {
        this.#cpf = cpf;
        this.#titulacao = titulacao;
        this.#dataAdmissao = dataAdmissao;
    }

  
    async listar() {
        let SQL_text = "SELECT * FROM professores";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        
        for (let i = 0; i < rows.length; i++) {
            lista.push(new Professor_Model(
                rows[i]["cpf_professor"],
                rows[i]["titulacao"],
                rows[i]["dt_admissao"]
            ));
        }
        return lista;
    }

    async inserir() {

        if(!this.dt_admissao) {
            this.dt_admissao = new Date().toISOString().split('T')[0];
        }

        let SQL_text = `
            INSERT INTO professores (
                cpf_professor, 
                titulacao, 
                dt_admissao
            ) VALUES (?, ?, ?)
        `;
        
        let db = new Database();
        let valores = [
            this.#cpf,
            this.#titulacao,
            this.#dataAdmissao
        ];
        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }

    async obter(cpf) {
        let SQL_text = "SELECT * FROM professores WHERE cpf_professor = ?";
        let db = new Database();
        let valores = [cpf];
        let rows = await db.ExecutaComando(SQL_text, valores);
        
        if (rows.length > 0) {
            return new Professor_Model(
                rows[0]["cpf_professor"],
                rows[0]["titulacao"],
                rows[0]["dt_admissao"]
            );
        }
        return null;
    }

    async atualizar() {
        let SQL_text = `
            UPDATE professores SET
                titulacao = ?,
                dt_admissao = ?
            WHERE cpf_professor = ?
        `;
        
        let db = new Database();
        let valores = [
            this.#titulacao,
            this.#dataAdmissao,
            this.#cpf
        ];
        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }

async excluir() {
    try {
        let sql = "DELETE FROM professores WHERE cpf_professor = ?";
        let db = new Database();
        let resultado = await db.ExecutaComandoNonQuery(sql, [this.#cpf]); 
        return resultado;
    } catch (error) {
        console.error("Erro ao excluir professor:", error);
        return false;
    }
}
}

module.exports = Professor_Model;