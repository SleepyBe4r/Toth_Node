const Database = require("../utils/database");

class Notas_Model{

    #id_nota;
    #id_atividade;
    #peso;
    #nota;
    #feedback;
    #atividade_resposta;
    #atividade_resposta_extencao;
    #status;
    #id_matricula;
    #id_quadro;

    get id_nota() {
        return this.#id_nota;
    }

    set id_nota(value) {
        this.#id_nota = value;
    }

    get id_atividade() {
        return this.#id_atividade;
    }

    set id_atividade(value) {
        this.#id_atividade = value;
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

    get atividade_resposta() {
        return this.#atividade_resposta;
    }

    set atividade_resposta(value) {
        this.#atividade_resposta = value;
    }

    get atividade_resposta_extencao() {
        return this.#atividade_resposta_extencao;
    }

    set atividade_resposta_extencao(value) {
        this.#atividade_resposta_extencao = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    get id_matricula() {
        return this.#id_matricula;
    }

    set id_matricula(value) {
        this.#id_matricula = value;
    }

    get id_quadro() {
        return this.#id_quadro;
    }

    set id_quadro(value) {
        this.#id_quadro = value;
    }

    constructor(
        id_nota,
        id_atividade,
        peso,
        nota,
        feedback,
        atividade_resposta,
        atividade_resposta_extencao,
        status,
        id_matricula,
        id_quadro
    ) {
        this.#id_nota = id_nota;
        this.#id_atividade = id_atividade;
        this.#peso = peso;
        this.#nota = nota;
        this.#feedback = feedback;
        this.#atividade_resposta = atividade_resposta;
        this.#atividade_resposta_extencao = atividade_resposta_extencao;
        this.#status = status;
        this.#id_matricula = id_matricula;
        this.#id_quadro = id_quadro;
    }

    async listar(){
        let SQL_text = "SELECT * FROM notas";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Notas_Model( rows[i]["id_nota"],
                                        rows[i]["id_atividade"],
                                        rows[i]["peso"],
                                        rows[i]["nota"],
                                        rows[i]["feedback"],
                                        rows[i]["atividade_resposta"],
                                        rows[i]["atividade_resposta_extencao"],
                                        rows[i]["status"],
                                        rows[i]["id_matricula"],
                                        rows[i]["id_quadro"]
            ));
        }
        return lista;
    }

    async listar_por_matricula() {
        let SQL_text = "SELECT * FROM notas WHERE id_matricula = ?";
        let db = new Database();
        let valores = [this.#id_matricula];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for (let i = 0; i < rows.length; i++) {
            lista.push(new Notas_Model(
                rows[i]["id_nota"],
                rows[i]["id_atividade"],
                rows[i]["peso"],
                rows[i]["nota"],
                rows[i]["feedback"],
                rows[i]["atividade_resposta"],
                rows[i]["atividade_resposta_extencao"],
                rows[i]["status"],
                rows[i]["id_matricula"],
                rows[i]["id_quadro"]
            ));
        }
        return lista;
    }
    
    async obter(id_nota){
        let SQL_text = "SELECT * FROM notas WHERE id_nota = ?";
        let db = new Database();
        let valores = [id_nota];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Notas_Model( rows[i]["id_nota"],
                                        rows[i]["id_atividade"],
                                        rows[i]["peso"],
                                        rows[i]["nota"],
                                        rows[i]["feedback"],
                                        rows[i]["atividade_resposta"],
                                        rows[i]["atividade_resposta_extencao"],
                                        rows[i]["status"],
                                        rows[i]["id_matricula"],
                                        rows[i]["id_quadro"]
            ));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO notas (id_atividade, peso, nota, feedback, atividade_resposta, atividade_resposta_extencao, status, id_matricula, id_quadro) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let db = new Database();
        let valores = [
            this.#id_atividade,
            this.#peso,
            this.#nota,
            this.#feedback,
            this.#atividade_resposta,
            this.#atividade_resposta_extencao,
            this.#status,
            this.#id_matricula,
            this.#id_quadro
        ];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE notas 
                        SET  peso = ?, nota = ?, feedback = ?, atividade_resposta = ?, atividade_resposta_extencao = ?, status = ?, id_matricula = ?, id_quadro = ?
                        WHERE id_nota = ?;`;
        let db = new Database();
        let valores = [
            this.#peso,
            this.#nota,
            this.#feedback,
            this.#atividade_resposta,
            this.#atividade_resposta_extencao,
            this.#status,
            this.#id_matricula,
            this.#id_quadro,
            this.#id_nota
        ];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM notas WHERE id_nota = ?";
        let db = new Database();
        let valores = [this.#id_nota];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = Notas_Model;