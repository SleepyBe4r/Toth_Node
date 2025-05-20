const Database = require("../utils/database");

class Login_Model{

    #pessoa_cpf
    #usuario
    #senha
    #perfil

    get pessoa_cpf(){        
        return this.#pessoa_cpf;
    }

    set pessoa_cpf(value){
        this.#pessoa_cpf = value;
    }

    get perfil(){        
        return this.#perfil;
    }
    
    get usuario(){
        return this.#usuario;
    }

    set perfil(value){
        this.#perfil = value;
    }
    
    get usuario(){
        return this.#usuario;
    }

    set usuario(value){
        this.#usuario = value;
    }

    get senha(){
        return this.#senha;
    }

    set senha(value){
        this.#senha = value;
    }

    constructor(cpf, usuario, senha, perfil){
        this.#pessoa_cpf = cpf;
        this.#usuario = usuario;
        this.#senha = senha;
        this.#perfil = perfil;    
    }

    async logar(usuario, senha){
        let SQL_text = "SELECT * from logins WHERE usuario = ? and senha = ?";
        let db = new Database();
        let valores = [usuario, senha];
        let lista = [];
        
        let rows = await db.ExecutaComando(SQL_text, valores);

        for (let i = 0; i < rows.length; i++) {
            lista.push(new Login_Model( rows[i]["pessoa_cpf"],
                                        rows[i]["usuario"],
                                        rows[i]["senha"],
                                        rows[i]["id_perfil"]
            ));
        }
        return lista;
    }

    async obter(id){
        let SQL_text = "SELECT * from logins WHERE pessoa_cpf = ?";
        let db = new Database();
        let valores = [id];
        let lista = [];
        
        let rows = await db.ExecutaComando(SQL_text, valores);

        for (let i = 0; i < rows.length; i++) {
            lista.push(new Login_Model( rows[i]["pessoa_cpf"],
                                        rows[i]["usuario"],
                                        rows[i]["senha"],
                                        rows[i]["id_perfil"]
            ));
        }
        return lista;
    }

    
}

module.exports = Login_Model;