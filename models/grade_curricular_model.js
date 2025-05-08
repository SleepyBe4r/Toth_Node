const Database = require("../utils/database");

class grade_curricular_Model{

    #id;
    #id_item;
    #id_turma;
    #id_disciplina;
    #cpf_professor;

    get id(){
        return this.#id;
    }

    set id(value){        
        this.#id = value;
    }

    get id_item(){
        return this.#id_item;
    }

    set id_item(value){        
        this.#id_item = value;
    }

    get id_turma(){
        return this.#id_turma;
    }

    set id_turma(value){        
        this.#id_turma = value;
    }

    get id_disciplina(){
        return this.#id_disciplina;
    }

    set id_disciplina(value){        
        this.#id_disciplina = value;
    }

    get cpf_professor(){
        return this.#cpf_professor;
    }

    set cpf_professor(value){        
        this.#cpf_professor = value;
    }

    constructor(id, id_item, id_turma, id_disciplina, cpf_professor){
        this.#id = id;
        this.#id_item = id_item;
        this.#id_turma = id_turma;
        this.#id_disciplina = id_disciplina;
        this.#cpf_professor = cpf_professor;
    }

    async listar(){
        let SQL_text = "SELECT * FROM grade_curricular";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            lista.push(new grade_curricular_Model(rows[i]["id_grade"], 
                                                  rows[i]["id_item"], 
                                                  rows[i]["id_turma"], 
                                                  rows[i]["id_disciplina"], 
                                                  rows[i]["cpf_professor"],));
        }
        return lista;
    }

    async listar_por_turma(){
        let SQL_text = "SELECT * FROM grade_curricular";
        let db = new Database();
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text);
        for(let i = 0; i < rows.length; i++){
            if(lista.length > 0){
                let tem_turma = 0;
                lista.forEach(grade =>{
                    if(grade.id_turma == rows[i]["id_turma"]) tem_turma++;
                })
                if (tem_turma == 0) {
                    lista.push(new grade_curricular_Model(rows[i]["id_grade"], 
                                                          rows[i]["id_item"], 
                                                          rows[i]["id_turma"], 
                                                          rows[i]["id_disciplina"], 
                                                          rows[i]["cpf_professor"],));    
                }
            } else {
                lista.push(new grade_curricular_Model(rows[i]["id_grade"], 
                                                      rows[i]["id_item"], 
                                                      rows[i]["id_turma"], 
                                                      rows[i]["id_disciplina"], 
                                                      rows[i]["cpf_professor"],));
            }
        }
        return lista;
    }

    async inserir(){
        let SQL_text = `INSERT INTO grade_curricular (id_turma, id_grade, id_item, id_disciplina, cpf_professor) 
                        VALUES (?, ?, ?, ?, ?);`;
        let db = new Database();
        let valores = [this.#id_turma, this.#id, this.#id_item, this.#id_disciplina, this.#cpf_professor];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async obter(id){             
        let SQL_text = "SELECT * FROM grade_curricular WHERE id_grade = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        let rows = await db.ExecutaComando(SQL_text, valores);
        for(let i = 0; i < rows.length; i++){
            lista.push(new grade_curricular_Model(rows[i]["id_grade"], 
                                                  rows[i]["id_item"], 
                                                  rows[i]["id_turma"], 
                                                  rows[i]["id_disciplina"], 
                                                  rows[i]["cpf_professor"],));
        }

        return lista;
    }

    
    async selecionar_ultimo_id(){             
        let SQL_text = "SELECT id_grade FROM grade_curricular ORDER BY id_grade DESC LIMIT 1";
        let db = new Database();
        let id;
        let rows = await db.ExecutaComando(SQL_text, valores);
        id = rows[0]["ïd_grade"];

        return id;
    }

    async atualizar(){
        let SQL_text = `UPDATE grade_curricular 
                        SET id_turma = ?, id_disciplina = ?, cpf_professor = ? 
                        WHERE id_item = ? AND id_grade = ?;`;
        let db = new Database();
        let valores = [this.#id_turma, this.#id_disciplina, this.#cpf_professor, this.#id_item, this.#id];        
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);        
        return resultado;
    }

    async excluir(){
        let SQL_text = "DELETE FROM grade_curricular WHERE id_grade = ? AND id_item = ?";
        let db = new Database();
        let valores = [this.#id, this.#id_item];
        let resultado = await db.ExecutaComandoNonQuery(SQL_text, valores);
        return resultado;
    }
}

module.exports = grade_curricular_Model;