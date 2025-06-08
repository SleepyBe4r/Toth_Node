const Ano_Letivo_Model = require("../models/ano_letivo_model");
const Atividade_Model = require("../models/atividade_model");
const Disciplina_Model = require("../models/disciplina_model");
const Disciplina_Serie_Model = require("../models/disciplina_serie_model");
const Matricula_Model = require("../models/matricula_model");
const Notas_Model = require("../models/notas_model");
const PessoaModel = require("../models/pessoa_model");
const Quadro_Notas_Model = require("../models/quadro_notas_model");
const Serie_Model = require("../models/serie_model");
const Turma_Model = require("../models/turma_model");

class Atividade_Controller{
  
    async listar_view_professor(req, resp){
        let atividade_M = new Atividade_Model();
        let lista_atividades_DB = await atividade_M.listar();

        let lista_atividades = lista_atividades_DB.map(atividade => ({
            id_atividades: atividade.id_atividades,
            nome: atividade.nome,
            descricao: atividade.descricao,
            dt_inicio: atividade.dt_inicio,
            dt_final: atividade.dt_final,
            id_quadro: atividade.id_quadro,
            status: "sem notas" // Inicializa o status como "sem notas"
        }));
        
        let notas_M = new Notas_Model();

        for(let i = 0; i < lista_atividades.length; i++){
            notas_M.id_atividade = lista_atividades[i].id_atividades;
            let lista_notas = await notas_M.listar_por_atividade();
            if(lista_notas.length > 0){
                lista_atividades[i].status = lista_notas[0].status;
            } else{
                lista_atividades[i].status = "sem notas";
            }
        }
        
        resp.render("atividade/listar_atividade_P.ejs", { layout: "layout_professor_home.ejs", lista_atividades});
    }

    async listar_view_aluno(req, resp){
        let atividade_M = new Atividade_Model();
        let notas_M = new Notas_Model();
        let disciplina_M = new Disciplina_Model();
        let matricula_M = new Matricula_Model();
        let lista_matricula = await matricula_M.obter_por_aluno(req.cookies.usuario_logado);

        notas_M.id_matricula = lista_matricula[0].id_matricula;
        let lista_notas = await notas_M.listar_por_matricula();
        let lista_atividades = []
        for(let i = 0; i < lista_notas.length; i++){
            let atividade = await atividade_M.obter(lista_notas[i].id_atividade);
            
            let quadro_notas_M = new Quadro_Notas_Model();
            let quadro_notas = await quadro_notas_M.obter(atividade[0].id_quadro);

            let disciplinas = await disciplina_M.obter(quadro_notas[0].id_disciplina);            

            if(lista_notas[i].status != "fechada"){
                lista_atividades.push({
                    id_nota: lista_notas[i].id_nota,
                    nome: atividade[0].nome,
                    dt_inicio: atividade[0].dt_inicio,
                    dt_final: atividade[0].dt_final,
                    disciplina: disciplinas[0].nome
                });
            }
        }

        let disc_serie_M = new Disciplina_Serie_Model();
        let lista_disciplina_serie = await disc_serie_M.listar_por_serie(lista_matricula[0].id_series);

        let lista_disciplina_aluno = [];
        for(let i = 0; i < lista_disciplina_serie.length; i++){
            let disciplina = await disciplina_M.obter(lista_disciplina_serie[i].id_disciplina);
            lista_disciplina_aluno.push(disciplina[0].nome);
        }

        resp.render("atividade/listar_atividade_A.ejs", { layout: "layout_aluno_home.ejs", lista_atividades, lista_disciplina_aluno});
    }

    async listar_ver_mais_A(req, resp){ 
        
        let atividade_M = new Atividade_Model();
        let notas_M = new Notas_Model();
        const id = req.params.id;
        
        let lista_notas = await notas_M.obter(id);    
        let lista_atividades = await atividade_M.obter(lista_notas[0].id_atividade);
        
        let atividade = {
            id_nota: lista_notas[0].id_nota,
            nome: lista_atividades[0].nome,
            descricao: lista_atividades[0].descricao,
            dt_inicio: lista_atividades[0].dt_inicio,
            dt_final: lista_atividades[0].dt_final,
            peso: lista_notas[0].peso,
            nota: lista_notas[0].nota,
            feedback: lista_notas[0].feedback,
            atividade_resposta: lista_notas[0].atividade_resposta,
            status: lista_notas[0].status
        };
        
        
        resp.render("atividade/ver_mais_A.ejs", { layout: "layout_aluno_home.ejs", atividade});
    }

    async responder_atividade(req, resp){
        if( req.body.id_atividade != "" || req.file != null ||
            req.body.resposta_extencao != ""){
            
            let notas_M = new Notas_Model();
            let lista_notas = await notas_M.obter(req.body.id_atividade);

            notas_M.id_nota = lista_notas[0].id_nota;
            notas_M.id_atividade = req.body.id_atividade;
            notas_M.peso = lista_notas[0].peso;
            notas_M.nota = lista_notas[0].nota;
            notas_M.feedback = lista_notas[0].feedback;
            notas_M.atividade_resposta = req.file.buffer;
            notas_M.atividade_resposta_extencao = req.body.resposta_extencao;
            notas_M.status = "respondida";
            notas_M.id_matricula = lista_notas[0].id_matricula;
            notas_M.id_quadro = lista_notas[0].id_quadro;

            let resposta = await notas_M.atualizar();

            if(resposta){
                resp.send({
                    ok : true,
                    msg: "Atividade respondida com sucesso"
                })
                return;
            } else{
                resp.send({
                    ok : false,
                    msg: "Erro ao responder a Atividade"
                })
                return;
            }
        } else{
            resp.send({
                ok : false,
                msg: "Erro ao responder a Atividade"
            })
        }
        let id_atividades = req.body.id_atividades;
        let id_matricula = req.body.id_matricula;
        let resposta = req.body.resposta;
        let status = req.body.status;

        let atividade_M = new Atividade_Model();
        atividade_M.id = id_atividades;
        atividade_M.id_matricula = id_matricula;
        atividade_M.txt_atividade_resposta = resposta;
        atividade_M.status = status;

        let lista_atividade = await atividade_M.responder();
        if(lista_atividade){
            
        } else{
            
        }
    }

    async listar_ver_mais_P(req, resp){ 
        
        let atividade_M = new Atividade_Model();
        let notas_M = new Notas_Model();
        let matricula_M = new Matricula_Model();
        let pessoa_M = new PessoaModel();
        let quadro_notas_M = new Quadro_Notas_Model();
        let id = req.params.id;

        let lista_atividades = await atividade_M.obter(id);
        notas_M.id_atividade = lista_atividades[0].id_atividades;
        let lista_notas = await notas_M.listar_por_atividade();    
        let lista_quadro = await quadro_notas_M.obter(lista_atividades[0].id_quadro);   

        matricula_M.id_ano_letivo = lista_quadro[0].id_ano_letivo;
        matricula_M.id_series = lista_quadro[0].id_series;
        matricula_M.id_turma = lista_quadro[0].id_turma;
        let lista_matricula = await matricula_M.listar_por_turma();

        let notas_para_corrigir = [];
        for(let i = 0; i < lista_matricula.length; i++){
            let lista_pessoas = await pessoa_M.obter(lista_matricula[0].cpf_aluno);
            let nota = lista_notas.find(nota => nota.id_matricula === lista_matricula[i].id_matricula);                    

            notas_para_corrigir.push({
                id_nota: nota.id_nota,
                nome: lista_pessoas.nome,
                nota: nota.nota,
                feedback: nota.feedback,
                nome_arquivo: `resposta_${lista_pessoas.nome}.${nota.atividade_resposta_extencao}`,
                status: nota.status,
                id_matricula: nota.id_matricula,
            });
        }

        let atividade = {
            id_atividade: lista_atividades[0].id_atividades,
            nome: lista_atividades[0].nome,
            descricao: lista_atividades[0].descricao,
            dt_inicio: lista_atividades[0].dt_inicio,
            dt_final: lista_atividades[0].dt_final
        };

        let turma_M = new Turma_Model();
        let turma = await turma_M.obter(lista_quadro[0].id_turma);
        turma = turma[0];

        let serie_M = new Serie_Model();
        let serie = await serie_M.obter(lista_quadro[0].id_series);
        serie = serie[0];

        let ano_letivo_M = new Ano_Letivo_Model();
        let ano = await ano_letivo_M.obter(lista_quadro[0].id_ano_letivo);
        ano = ano[0];

        let disciplina_M = new Disciplina_Model();
        let disciplina = await disciplina_M.obter(lista_quadro[0].id_disciplina);
        disciplina = disciplina[0];

        let print_info = {
            nome_turma: turma?.turma || "",
            nome_serie: serie?.serie || "",
            nome_ano: ano?.ano_letivo || "",
            bimestre: lista_quadro[0].bimestre,
            nome_disciplina: disciplina?.nome || "",
        };

        resp.render("atividade/ver_mais_P.ejs", { layout: "layout_professor_home.ejs", atividade, notas_para_corrigir, print_info });
    }

    async baixar_resposta(req, resp){
        const id_nota = req.params.id_nota;

        const notas_M = new Notas_Model();
        const matricula_M = new Matricula_Model();
        const pessoa_M = new PessoaModel();

        const nota = await notas_M.obter(id_nota);        
        const matricula = await matricula_M.obter(nota[0].id_matricula);
        const pessoa = await pessoa_M.obter(matricula[0].cpf_aluno); // ou equivalente

        if (!nota[0] || !nota[0].atividade_resposta) {
            return resp.status(404).send("Arquivo não encontrado");
        }

        const nomeArquivo = `resposta_${pessoa.nome}.${nota[0].atividade_resposta_extencao}`;

        resp.set({
            'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
            'Content-Type': 'application/octet-stream',
        });

        resp.send(nota[0].atividade_resposta); // deve ser o buffer do blob
    }

    async listar_cadastro(req, resp){
        let atividade_para_alterar = undefined;

        resp.render("atividade/cadastrar_view.ejs",{ 
            layout: "layout_professor_home.ejs", 
            atividade_para_alterar});
    }

    async cadastrar_atividade(req, resp){
        if( req.body.nome == "" || req.body.descricao == "" || 
            req.body.dt_inicial == "" || req.body.dt_final == "" || req.body.dt_inicial > req.body.dt_final){
            resp.send({
                ok : false,
                msg: "campos invalidos"
            })
            return;
        }

        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let dt_inicial = req.body.dt_inicial;
        let dt_final = req.body.dt_final;

        let atividade_M = new Atividade_Model();
        atividade_M.nome = nome;
        atividade_M.descricao = descricao;
        atividade_M.dt_inicio = dt_inicial;
        atividade_M.dt_final = dt_final;

        let resposta_atividade = await atividade_M.inserir();

        if(resposta_atividade){
            resp.send({
                ok : true,
                msg: "Atividade cadastrada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao cadastrar a Atividade"
            })
        }
    }

    async corrigir_atividade(req, resp){
        if( req.body.length == ""){
            resp.send({
                ok : false,
                msg: "campos invalidos"
            })
            return;
        }

        let notas = req.body;
        let notas_M = new Notas_Model();
        
        let lista_resposta = [];
        for (const nota of notas) {
            let nota_old = await notas_M.obter(nota.id_nota);
            nota_old = nota_old[0];

            notas_M.id_nota = nota.id_nota;
            notas_M.id_atividade = nota_old.id_atividade;
            notas_M.peso = nota_old.peso;
            notas_M.nota = nota.nota;
            notas_M.feedback = nota.feedback;
            notas_M.atividade_resposta = nota_old.atividade_resposta;
            notas_M.atividade_resposta_extencao = nota_old.atividade_resposta_extencao;
            notas_M.status = "corrigida";
            notas_M.id_matricula = nota_old.id_matricula;
            notas_M.id_quadro = nota_old.id_quadro;
            
            let resultado_nota = await notas_M.atualizar();
            
            if (resultado_nota) lista_resposta.push("ok");
        }

        if(notas.length == lista_resposta.length){
            resp.send({
                ok : true,
                msg: "Correção atualizada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao atualizar a Correção"
            })
        }

    }

    async listar_editar(req, resp){
        const id = req.params.id;
        let atividade_M = new Atividade_Model();
        let atividade_para_alterar = await atividade_M.obter(id);
        atividade_para_alterar = atividade_para_alterar[0];

        resp.render("atividade/cadastrar_view.ejs", { layout: "layout_professor_home.ejs", atividade_para_alterar});
    }

    async editar_atividade(req, resp){
        if( req.body.nome == "" || req.body.descricao == "" || 
            req.body.dt_inicial == "" || req.body.dt_final == "" || req.body.dt_inicial > req.body.dt_final){
            resp.send({
                ok : false,
                msg: "campos invalidos"
            })
            return;
        }

        let id_atividades = req.body.id;
        let nome = req.body.nome;
        let descricao = req.body.descricao;
        let dt_inicial = req.body.dt_inicial;
        let dt_final = req.body.dt_final;

        let atividade_M = new Atividade_Model();
        atividade_M.id_atividades = id_atividades;
        atividade_M.nome = nome;
        atividade_M.descricao = descricao;
        atividade_M.dt_inicio = dt_inicial;
        atividade_M.dt_final = dt_final;

        let resposta_atividade = await atividade_M.atualizar();

        if(resposta_atividade){
            resp.send({
                ok : true,
                msg: "Atividade editada com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao editar a Atividade"
            })
        }
    }

    async excluir_atividade(req, resp){
        let atividade_M = new Atividade_Model();
        atividade_M.id_atividades = req.body.id;

        let lista_atividade = await atividade_M.excluir();
        if(lista_atividade){
            resp.send({
                ok : true
            })
        } else{            
            resp.send({
                ok : false
            })
        }
    }

    async filtrar(req, res) {
        let atividade_M = new Atividade_Model();
        // Filtra atividades usando apenas o termo de busca (query.termo)
        let termo = req.query.termo || "";
        let lista_atividades_DB = await atividade_M.listar(termo);

        // Retorna apenas as atividades encontradas
        let lista_atividades = [];
        for (let i = 0; i < lista_atividades_DB.length; i++) {
            lista_atividades.push({
                id_atividade: lista_atividades_DB[i].id_atividades,
                nome: lista_atividades_DB[i].nome,
                descricao: lista_atividades_DB[i].descricao,
                dt_inicio: lista_atividades_DB[i].dt_inicio,
                dt_final: lista_atividades_DB[i].dt_final,
                id_quadro: lista_atividades_DB[i].id_quadro
            });
        }
        res.send({lista: lista_atividades});
        }

    async liberar_atividade(req, res) {
        let notas_M = new Notas_Model();

        notas_M.id_atividade = req.body.atividade_id;
        let lista_notas = await notas_M.listar_por_atividade();
        let lista_resposta = [];

        if (lista_notas.length > 0) {
            // Se houver notas, atualiza o status delas para 'liberado'
            for (let i = 0; i < lista_notas.length; i++) {
                notas_M.id_nota = lista_notas[i].id_nota;
                notas_M.id_atividade = lista_notas[i].id_atividade;
                notas_M.peso = lista_notas[i].peso;
                notas_M.nota = lista_notas[i].nota;
                notas_M.feedback = lista_notas[i].feedback;
                notas_M.atividade_resposta = lista_notas[i].atividade_resposta;
                notas_M.atividade_resposta_extencao = lista_notas[i].atividade_resposta_extencao;
                notas_M.id_matricula = lista_notas[i].id_matricula;
                notas_M.id_quadro = lista_notas[i].id_quadro;
                // Atualiza o status da nota para 'liberado'
                notas_M.status = "liberado";
                if (await notas_M.atualizar()) {
                    lista_resposta.push("ok");
                }
            }
        }

        if (lista_resposta.length == lista_notas.length) {
            res.send({ ok: true, msg: "Atividade liberada com sucesso" });
        } else {
            res.send({ ok: false, msg: "Erro ao liberar a Atividade" });
        }
    }
}

module.exports = Atividade_Controller;