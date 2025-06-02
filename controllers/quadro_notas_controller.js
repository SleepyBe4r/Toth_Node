const Ano_Letivo_Model = require("../models/ano_letivo_model");
const Atividade_Model = require("../models/atividade_model");
const Disciplina_Model = require("../models/disciplina_model");
const Disciplina_Serie_Model = require("../models/disciplina_serie_model");
const Matricula_Model = require("../models/matricula_model");
const Notas_Model = require("../models/notas_model");
const Quadro_Notas_Model = require("../models/quadro_notas_model");
const Serie_Model = require("../models/serie_model");
const Turma_Model = require("../models/turma_model");

class Quadro_Notas_Controller{

    async listar_view(req, resp){
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let quadro_notas_M = new Quadro_Notas_Model();
        let lista_quadro_notas_DB = await quadro_notas_M.listar("","","","", req.cookies.usuario_logado, "");

        let lista_quadro_notas = [];
        for (let i = 0; i < lista_quadro_notas_DB.length; i++) {
            lista_quadro_notas.push({
                id_quadro: lista_quadro_notas_DB[i].id_quadro,
                cpf_professor: lista_quadro_notas_DB[i].cpf_professor,
                id_turma: lista_quadro_notas_DB[i].id_turma,
                nome_turma: lista_turmas.find(e => e.id == lista_quadro_notas_DB[i].id_turma)?.turma || "",
                id_series: lista_quadro_notas_DB[i].id_series,
                nome_serie: lista_series.find(e => e.id == lista_quadro_notas_DB[i].id_series)?.serie || "",
                id_ano_letivo: lista_quadro_notas_DB[i].id_ano_letivo,
                nome_ano: lista_anos.find(e => e.id == lista_quadro_notas_DB[i].id_ano_letivo)?.ano_letivo || "",	
                bimestre: lista_quadro_notas_DB[i].bimestre,
                id_disciplina: lista_quadro_notas_DB[i].id_disciplina,
                nome_disciplina: lista_disciplinas.find(e => e.id == lista_quadro_notas_DB[i].id_disciplina)?.nome || "",
            });
        }

        resp.render("quadro_notas/listar_quadro_notas.ejs", { 
            layout: "layout_professor_home.ejs", 
            lista_quadro_notas,
            lista_turmas,
            lista_series,
            lista_anos,
            lista_disciplinas
        });
    }

    async listar_cadastro(req, resp){
        let quadro_notas_para_alterar  = undefined;

        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let atividade_M = new Atividade_Model();
        let lista_atividades = await atividade_M.listar_sem_quadro();

        resp.render("quadro_notas/cadastrar_view.ejs", { 
            layout: "layout_professor_home.ejs", 
            quadro_notas_para_alterar,
            lista_turmas,
            lista_series,
            lista_anos,
            lista_disciplinas,
            lista_atividades});
    }

    async cadastrar_quadro_notas(req, resp) {
        if(req.body.id_ano_letivo == "" || req.body.id_serie == "" || req.body.id_turma == "" || 
            req.body.bimestre == "" || req.body.id_disciplina == "" || req.body.atividades.length == 0){ 
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        

        let id_ano_letivo = parseInt(req.body.id_ano_letivo);
        let id_serie = parseInt(req.body.id_serie);
        let id_turma = parseInt(req.body.id_turma);
        let bimestre = parseInt(req.body.bimestre);
        let id_disciplina = parseInt(req.body.id_disciplina);
        let atividades = req.body.atividades;
        let cpf_professor = req.cookies.usuario_logado;

        let quadro_notas_M = new Quadro_Notas_Model();
        quadro_notas_M.id_ano_letivo = id_ano_letivo;
        quadro_notas_M.id_series = id_serie;
        quadro_notas_M.id_turma = id_turma;
        quadro_notas_M.bimestre = bimestre;
        quadro_notas_M.id_disciplina = id_disciplina;     
        quadro_notas_M.cpf_professor = cpf_professor;

        let lista_quadro = await quadro_notas_M.listar(id_ano_letivo, id_serie, id_turma, bimestre, "", id_disciplina);

        if (lista_quadro.length > 0) {
            resp.send({
                ok : false,
                msg: "Quadro Já existe"
            })
            return;
        }

        let resultado_quadro = await quadro_notas_M.inserir();
        let ultimo_id_quadro = await quadro_notas_M.obter_ultimo_id();
        
        let resposta_atividade = [];
        let resposta_nota = [];

        if(resultado_quadro){
            let atividade_M = new Atividade_Model();
            for(let i = 0; i < atividades.length; i++){
                let atividade = await atividade_M.obter(atividades[i].id_atividade);
                if(atividade.length > 0){
                    atividade_M.id_atividades = atividade[0].id_atividades;
                    atividade_M.nome = atividade[0].nome;
                    atividade_M.descricao = atividade[0].descricao;
                    atividade_M.dt_inicio = atividade[0].dt_inicio;
                    atividade_M.dt_final = atividade[0].dt_final;
                    atividade_M.id_quadro = ultimo_id_quadro;
                    await atividade_M.atualizar() == true ? resposta_atividade.push(true) : '';
                }
            }

            let matricula_M = new Matricula_Model();
            matricula_M.id_ano_letivo = id_ano_letivo;
            matricula_M.id_series = id_serie;
            matricula_M.id_turma = id_turma;

            let lista_matriculas = await matricula_M.listar_por_turma();
            for(let i = 0; i < lista_matriculas.length; i++){
                let matricula = lista_matriculas[i];
                for(let j = 0; j < atividades.length; j++){
                    let atividade = atividades[j];
                    let quadro_notas_atividade_M = new Notas_Model();
                    quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                    quadro_notas_atividade_M.id_atividade = atividade.id_atividade;
                    quadro_notas_atividade_M.id_quadro = ultimo_id_quadro;
                    quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                    quadro_notas_atividade_M.peso = atividade.peso;


                    let atividade_DB = await atividade_M.obter(atividades[i].id_atividade);

                    let hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);

                    let dt_inicio = new Date(atividade_DB[0].dt_inicio);
                    let dt_final = new Date(atividade_DB[0].dt_final);

                    const dataInicio = new Date(dt_inicio.getFullYear(), dt_inicio.getMonth(), dt_inicio.getDate());
                    const dataFim = new Date(dt_final.getFullYear(), dt_final.getMonth(), dt_final.getDate());

                    if (hoje < dataInicio || hoje > dataFim) {
                        quadro_notas_atividade_M.status = "fechada";
                    } else {
                        quadro_notas_atividade_M.status = "aberto";
                    }

                    await quadro_notas_atividade_M.inserir() == true ? resposta_nota.push(true) : '';
                }
            }

        }
        
        if(atividades.length == resposta_atividade.length && resposta_nota.length > 0){
            resp.send({
                ok : true,
                msg: "Quadro de Notas cadastrado com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao inserir o Quadro de Notas"
            })
        }
    }
    
    async excluir_quadro_notas(req, resp){
        let quadro_notas_M = new Quadro_Notas_Model();
        quadro_notas_M.id_quadro = req.body.id;

        let lista_quadro_notas = await quadro_notas_M.excluir();
        if(lista_quadro_notas){
            resp.send({
                ok : true
            })
        } else{            
            resp.send({
                ok : false
            })
        }
    }

    async listar_editar(req, resp){
        const id_quadro = req.params.id;
        let quadro_notas_M = new Quadro_Notas_Model();        
        let quadro_notas_para_alterar = await quadro_notas_M.obter(id_quadro);
        quadro_notas_para_alterar  = quadro_notas_para_alterar[0];

        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let disc_serie_M = new Disciplina_Serie_Model();
        let lista_disc_serie = await disc_serie_M.listar_por_serie(quadro_notas_para_alterar.id_series);

        let disciplina_M = new Disciplina_Model();
        let lista = await disciplina_M.listar();

        let lista_disciplinas = [];

        lista_disc_serie.forEach(item_disc_serie => {
            for (const item_disciplina of lista) {
                if(item_disc_serie.id_disciplina == item_disciplina.id){
                    lista_disciplinas.push({
                            id_disciplina : item_disciplina.id,
                            nome: item_disciplina.nome
                    });
                }
            }
        });

        let atividade_M = new Atividade_Model();
        let atividades_para_alterar = [];
        
        lista = await atividade_M.listar("", id_quadro);

        let notas_M = new Notas_Model();
        
        for (let i = 0; i < lista.length; i++) {
            notas_M.id_atividade = lista[i].id_atividades;
            let lista_notas = await notas_M.listar_por_atividade();
            
            atividades_para_alterar.push({
                id_atividades: lista[i].id_atividades,
                nome: lista[i].nome,
                descricao: lista[i].descricao,
                dt_inicio: lista[i].dt_inicio,
                dt_final: lista[i].dt_final,
                id_quadro: id_quadro,
                peso: lista_notas[0].peso + "%"
            });
            
        }

        let lista_atividades = await atividade_M.listar_sem_quadro();        

        resp.render("quadro_notas/cadastrar_view.ejs", { 
            layout: "layout_professor_home.ejs", 
            quadro_notas_para_alterar,
            lista_turmas,
            lista_series,
            lista_anos,
            lista_disciplinas,
            lista_atividades,
            atividades_para_alterar
        });
    }

    async editar_quadro_notas(req, resp) {
        if(req.body.id_quadro == "" || req.body.id_ano_letivo == "" || req.body.id_serie == "" || req.body.id_turma == "" || 
            req.body.bimestre == "" || req.body.id_disciplina == "" || req.body.atividades.length == 0){ 
            resp.send({
                ok : false,
                msg: "Campo incompleto"
            })
            return;
        }

        let id_quadro = parseInt(req.body.id_quadro);
        let id_ano_letivo = parseInt(req.body.id_ano_letivo);
        let id_serie = parseInt(req.body.id_serie);
        let id_turma = parseInt(req.body.id_turma);
        let bimestre = parseInt(req.body.bimestre);
        let id_disciplina = parseInt(req.body.id_disciplina);
        let atividades = req.body.atividades;
        let cpf_professor = req.cookies.usuario_logado;

        let quadro_notas_M = new Quadro_Notas_Model();
        quadro_notas_M.id_quadro = id_quadro;
        quadro_notas_M.id_ano_letivo = id_ano_letivo;
        quadro_notas_M.id_series = id_serie;
        quadro_notas_M.id_turma = id_turma;
        quadro_notas_M.bimestre = bimestre;
        quadro_notas_M.id_disciplina = id_disciplina;     
        quadro_notas_M.cpf_professor = cpf_professor;
        
        let lista_quadro = await quadro_notas_M.listar(id_ano_letivo, id_serie, id_turma, bimestre, cpf_professor, id_disciplina);

        let resultado_quadro = false;

        if (lista_quadro.length == 0) {
            resultado_quadro = await quadro_notas_M.atualizar();                    
        } else if(lista_quadro[0].id_quadro == id_quadro) {
            resultado_quadro = true;
        } else {
            resp.send({
                ok : false,
                msg: "Quadro Já existe"
            })
            return; 
        }

        let resposta_atividade = [];
        let resposta_nota = [];

        
        let atividade_M = new Atividade_Model();
        let atividades_antigas = await atividade_M.listar("", id_quadro);

        if(resultado_quadro){            
            
            atividades_antigas.forEach((ds_old, index) => {
                for (const atividade of atividades) {
                    if (ds_old.id_atividades == atividade.id_atividade) {                        
                        atividades_antigas.splice(index, 1); 
                    }                        
                }
            });
            
            for (let item_atividade of atividades) {

                let atividade = await atividade_M.obter(item_atividade.id_atividade);
                atividade = atividade[0];

                let atividade_nova = false;                
                
                if (atividade.id_quadro == null) {
                    atividade_M.id_atividades = atividade.id_atividades;
                    atividade_M.nome = atividade.nome;
                    atividade_M.descricao = atividade.descricao;
                    atividade_M.dt_inicio = atividade.dt_inicio;
                    atividade_M.dt_final = atividade.dt_final;
                    atividade_M.id_quadro = id_quadro;
                    await atividade_M.atualizar() == true ? resposta_atividade.push(true) : '';
                    atividade_nova = true;
                } else{
                    resposta_atividade.push(true);
                }

                if (atividade_nova) {
                    let matricula_M = new Matricula_Model();
                    matricula_M.id_ano_letivo = id_ano_letivo;
                    matricula_M.id_series = id_serie;
                    matricula_M.id_turma = id_turma;

                    let lista_matriculas = await matricula_M.listar_por_turma();
                    for(let i = 0; i < lista_matriculas.length; i++){
                        let matricula = lista_matriculas[i];
                        let quadro_notas_atividade_M = new Notas_Model();

                        quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                        quadro_notas_atividade_M.id_atividade = atividade.id_atividades;
                        quadro_notas_atividade_M.id_quadro = id_quadro;
                        quadro_notas_atividade_M.id_matricula = matricula.id_matricula;
                        quadro_notas_atividade_M.peso = item_atividade.peso;

                        let hoje = new Date();
                        hoje.setHours(0, 0, 0, 0);

                        let dt_inicio = new Date(atividade.dt_inicio);
                        let dt_final = new Date(atividade.dt_final);

                        const dataInicio = new Date(dt_inicio.getFullYear(), dt_inicio.getMonth(), dt_inicio.getDate());
                        const dataFim = new Date(dt_final.getFullYear(), dt_final.getMonth(), dt_final.getDate());

                        if (hoje < dataInicio || hoje > dataFim) {
                            quadro_notas_atividade_M.status = "fechada";
                        } else {
                            quadro_notas_atividade_M.status = "aberto";
                        }

                        await quadro_notas_atividade_M.inserir() == true ? resposta_nota.push(true) : '';
                        
                    }
                }else{
                    let notas_M = new Notas_Model();
                    notas_M.id_atividade = item_atividade.id_atividade;
                    let notas = await notas_M.listar_por_atividade();
                    if(notas.length > 0 && notas[0].peso != item_atividade.peso){
                        for(let i = 0; i < notas.length; i++){
                            let nota = notas[i];
                            let quadro_notas_atividade_M = new Notas_Model();
                            quadro_notas_atividade_M.id_nota = nota.id_nota;
                            quadro_notas_atividade_M.id_matricula = nota.id_matricula;
                            quadro_notas_atividade_M.id_atividade = nota.id_atividade;
                            quadro_notas_atividade_M.id_quadro = id_quadro;
                            quadro_notas_atividade_M.peso = item_atividade.peso;
                            await quadro_notas_atividade_M.atualizar() == true ? resposta_nota.push(true) : '';
                        }
                    }
                }
            } 
        }

        atividades_antigas.forEach(async (ds_old, index) => {
            let notas_M = new Notas_Model();
            notas_M.id_atividade = ds_old.id_atividade;
            let notas = await notas_M.listar_por_atividade();
            let cont_excluir = 0;
            for (let i = 0; i < notas.length; i++) {
                if(await notas_M.excluir(notas[i].id_nota)) cont_excluir++;
            }
            if(notas.length == cont_excluir) atividades_antigas.splice(index, 1);  
        });
        
        
        if(atividades.length == resposta_atividade.length){
            resp.send({
                ok : true,
                msg: "Quadro de Notas Editado com sucesso"
            })
        } else{            
            resp.send({
                ok : false,
                msg: "Erro ao Editar o Quadro de Notas"
            })
        }
    }

    async filtrar(req, res) {
        let quadro_notas_M = new Quadro_Notas_Model();
        let lista_quadro_notas_DB = await quadro_notas_M.listar(req.query.ano, req.query.serie, req.query.turma, req.query.bimestre, req.cookies.usuario_logado, req.query.disciplina);
        
        let turma_M = new Turma_Model();
        let lista_turmas = await turma_M.listar();

        let serie_M = new Serie_Model();
        let lista_series = await serie_M.listar();

        let ano_letivo_M = new Ano_Letivo_Model();
        let lista_anos = await ano_letivo_M.listar();

        let disciplina_M = new Disciplina_Model();
        let lista_disciplinas = await disciplina_M.listar();

        let lista_quadro = [];
        for (let i = 0; i < lista_quadro_notas_DB.length; i++) {
            lista_quadro.push({
                id_quadro: lista_quadro_notas_DB[i].id_quadro,
                cpf_professor: lista_quadro_notas_DB[i].cpf_professor,
                id_turma: lista_quadro_notas_DB[i].id_turma,
                nome_turma: lista_turmas.find(e => e.id == lista_quadro_notas_DB[i].id_turma)?.turma || "",
                id_series: lista_quadro_notas_DB[i].id_series,
                nome_serie: lista_series.find(e => e.id == lista_quadro_notas_DB[i].id_series)?.serie || "",
                id_ano_letivo: lista_quadro_notas_DB[i].id_ano_letivo,
                nome_ano: lista_anos.find(e => e.id == lista_quadro_notas_DB[i].id_ano_letivo)?.ano_letivo || "",	
                bimestre: lista_quadro_notas_DB[i].bimestre,
                id_disciplina: lista_quadro_notas_DB[i].id_disciplina,
                nome_disciplina: lista_disciplinas.find(e => e.id == lista_quadro_notas_DB[i].id_disciplina)?.nome || "",
            });
        }
        res.send({lista: lista_quadro});
    }
}

module.exports = Quadro_Notas_Controller;