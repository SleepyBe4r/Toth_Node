const Database = require("../ultils/database");

class Login_Model{

    #pessoa_cpf
    #usuario
    #senha
    #perfil

    get perfil(){        
        return this.#perfil;
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
                                        rows[i]["perfil"]
            ));
        }
        return lista;
    }

    
}

module.exports = Login_Model;