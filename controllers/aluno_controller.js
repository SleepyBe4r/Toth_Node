const AlunoModel = require("../models/aluno_model");
const PessoaModel = require("../models/pessoa_model");
class Aluno_Controller {
    
    async listar(req, res){
        let aluno_M = new AlunoModel();
        let lista_alunos = await aluno_M.listar();
        res.render("aluno/aluno_listar.ejs", {layout: "layout_admin_home.ejs", lista_alunos});
    }

    async cadastrar_view(req, res){
        res.render("aluno/aluno_cadastrar.ejs", {layout: "layout_admin_home.ejs"});
    }

    async cadastrar_aluno(req, res){
        if(req.body.cpf == "" && req.body.nome == "" && req.body.data == "" && req.body.email == "" && req.body.fone == "" && req.body.rua == "" && req.body.bairro == "" && req.body.convenio == ""){
            res.send({
                ok: false,
                msg: "Campo incompleto"
            })
            return;
        }

        let pessoa_M = new PessoaModel();
        pessoa_M.cpf = req.body.cpf;
        pessoa_M.nome = req.body.nome;
        pessoa_M.data = req.body.data;
        pessoa_M.email = req.body.email;
        pessoa_M.fone = req.body.fone;
        pessoa_M.rua = req.body.rua;
        pessoa_M.bairro= req.body.bairro;
        pessoa_M.convenio = req.body.convenio;
        let pessoa = await pessoa_M.inserir();

        if(pessoa){
            let aluno_M = new AlunoModel;
            aluno_M.cpf = req.body.cpf;
            aluno_M.convenio = req.body.convenio;
            let ok = await aluno_M.inserir();

            if(ok){
                res.send({
                    ok: true,
                    msg: "Aluno cadastrado com sucesso"
                })
            }
            else{
                res.send({
                    ok: false,
                    msg: "Erro ao inserir o Aluno"
                })
            }
        }
        else{
            res.send({
                pessoa: false,
                msg: "Erro ao cadastrar Pessoa"
            })
        }
        
    }

    async excluir(req, res){
        const aluno_M = new AlunoModel();
        aluno_M.cpf = req.body.cpf;
        const resultado = await aluno_M.excluir();
        let msg = "";
        if(resultado){
            const pessoa_M = new PessoaModel();
            pessoa_M.cpf = req.body.cpf;
            const pessoa = await pessoa_M.excluir();
            if(pessoa){
                msg = "Aluno excluído com sucesso!";
            }
            else{
                msg = "Não foi possível excluir";
            }
            
        }
        else{
            msg = "Não foi possível excluir "
        }
        res.json({
            ok: resultado,
            msg:msg
        });
    }

}

module.exports = Aluno_Controller;