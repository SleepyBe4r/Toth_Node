const Database = require("../utils/database");

class Atividade_Model{

    #id_atividades;
    #nome;  
    #descricao;  
    #dt_inicio;  
    #dt_final;  
    #id_quadro;

    get id_atividades() {
        return this.#id_atividades;
    }
    set id_atividades(value) {
        this.#id_atividades = value;
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

    get id_quadro() {
        return this.#id_quadro;
    }
    set id_quadro(value) {
        this.#id_quadro = value;
    }

    constructor(id_atividades, nome, descricao, dt_inicio, dt_final, id_quadro) {
        this.#id_atividades = id_atividades;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#dt_inicio = dt_inicio;
        this.#dt_final = dt_final;
        this.#id_quadro = id_quadro;
    }

    async listar(termo, quadro){
        //preparar o where para filtrar o sql
        let whereFiltro = "";
        let valores = [];
        if(termo && termo != "") {                        
             //validar se o termo é numero
            if(!isNaN(termo)) {
             // aqui filtro pelo nro do pedido
              whereFiltro = " where id_atividades = ? ";
              valores.push(termo);
            }
            else {
                //aqui filtro pelo nome do produto  
                
                whereFiltro = " where nome like ? ";
                valores.push("%"+ termo +"%");
            }
        }

        if(quadro && quadro != "") {
            if(valores.length == 0){
                whereFiltro += " WHERE id_quadro = ? ";       
                valores.push(quadro);
            } else {
                whereFiltro += "AND id_quadro = ? ";       
                valores.push(quadro);
            }
        }

        let SQL_text = `SELECT * FROM atividades ${whereFiltro}`;
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["id_atividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            rows[i]["id_quadro"]));
        }
        return lista;
    }

    async listar_sem_quadro(){
        let SQL_text = "SELECT * FROM atividades where id_quadro is null";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["id_atividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            rows[i]["id_quadro"]));
        }
        return lista;
    }

    async obter(id_atividades){
        let SQL_text = "SELECT * FROM atividades where id_atividades = ?";
        let db = new Database();
        let valores = [id_atividades];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new Atividade_Model( rows[i]["id_atividades"], 
                                            rows[i]["nome"],
                                            rows[i]["descricao"],
                                            rows[i]["dt_inicio"],
                                            rows[i]["dt_final"],
                                            rows[i]["id_quadro"]));
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO atividades 
                        (nome,descricao,dt_inicio,dt_final,id_quadro)
                        VALUES
                        (?,?,?,?,?);`;
        let db = new Database();
        let valores = [this.#nome, this.#descricao, this.#dt_inicio, this.#dt_final, this.#id_quadro];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async atualizar(){
        let SQL_text = `UPDATE atividades 
                        SET nome = ?, descricao = ?, dt_inicio = ?, dt_final = ?, id_quadro = ?
                        WHERE id_atividades = ?`;
        let db = new Database();
        let valores = [this.#nome, this.#descricao, this.#dt_inicio, this.#dt_final, this.#id_quadro, this.#id_atividades]; 
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores)
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM atividades WHERE id_atividades = ?";
        let db = new Database();
        let valores = [this.#id_atividades];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
    
}

module.exports = Atividade_Model;