
document.addEventListener("DOMContentLoaded", ()=>{

    function verificar_disciplina() {
        let input_disciplina = document.querySelector("#slctDisciplina");
        let input_turma = document.querySelector("#slctTurma");

        let obj = {
            id_disciplina : input_disciplina.options[input_disciplina.selectedIndex].value
        }

        fetch("/Turma/ObterPorDisc", {
            method :"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        .then((resposta) => resposta.json())
        .then((dados) => {
            if(dados.ok) {
                input_turma.disabled = false;
                let html = `<option value="" selected disabled>Selecione uma Turma</option>`;
                dados.lista.forEach(e => {
                    html += `<option value="${e.id}">${e.nome}</option>`;
                });
                if(html == `<option value="" selected disabled>Selecione uma Turma</option>`) 
                    html += `<option value="">Nenhuma Turma encontrada</option>`;
                input_turma.innerHTML = html;
            }
        })
        .catch((erro) => console.error("erro:", erro));
    }
    
    function verificar_turma() {
        let input_nome = document.querySelector("#txtNomeAtividade");
        let input_descricao = document.querySelector("#txtDescricao");
        let input_nota = document.querySelector("#txtNota");
        let input_peso = document.querySelector("#txtPeso");
        let input_dt_inicial = document.querySelector("#dtInicial");
        let input_dt_final = document.querySelector("#dtFinal");

        input_nome.disabled = false;
        input_descricao.disabled = false;
        input_nota.disabled = false;
        input_peso.disabled = false;
        input_dt_inicial.disabled = false;
        input_dt_final.disabled = false;
    }

    function cadastrar() {
        let input_disciplina = document.querySelector("#slctDisciplina");
        let input_turma = document.querySelector("#slctTurma");
        let input_nome = document.querySelector("#txtNomeAtividade");
        let input_descricao = document.querySelector("#txtDescricao");
        let input_nota = document.querySelector("#txtNota");
        let input_peso = document.querySelector("#txtPeso");
        let input_dt_inicial = document.querySelector("#dtInicial");
        let input_dt_final = document.querySelector("#dtFinal");
        let lista_validacao = [];
        let status = "fechada";
        if(confirm("Deseja deixar a atividade liberada para os alunos?"))
            status = "liberada";

        if (input_disciplina.value === "") lista_validacao.push(input_disciplina.id);
        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if (input_nome.value === "") lista_validacao.push(input_nome.id);
        if (input_descricao.value === "") lista_validacao.push(input_descricao.id);
        if (input_nota.value === "") lista_validacao.push(input_nota.id);
        if (input_peso.value === "") lista_validacao.push(input_peso.id);
        if (input_dt_inicial.value === "") lista_validacao.push(input_dt_inicial.id);
        if (input_dt_final.value === "") lista_validacao.push(input_dt_final.id);
    
        if(!validarDatasTurma(input_dt_inicial, input_dt_final, document.querySelector("#erro_dt")))
            return;

        if(lista_validacao.length == 0){
            let obj = {
                disciplina : input_disciplina.value,
                turma : input_turma.value,
                nome : input_nome.value,
                descricao : input_descricao.value,
                nota : input_nota.value,
                peso : input_peso.value,
                dt_inicial : input_dt_inicial.value,
                dt_final : input_dt_final.value,
                status : status
            }

            fetch("/atividade/cadastrar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/atividade/P_listar';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function responder() {
        let input_id_A = document.querySelector("#hidden_id_atividade");
        let input_resposta = document.querySelector("#txtResposta");
        let status = "";
        let lista_validacao = [];
        if(confirm("Deseja finalizar a Atividade?"))
            status = "finalizada";
        else
            return;

        if (input_resposta.value === "") lista_validacao.push(input_resposta.id);
    
        if(lista_validacao.length == 0){
            let obj = {
                id_atividade : input_id_A.value,
                resposta : input_resposta.value,
                status : status
            }

            fetch("/atividade/responder", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/atividade/A_listar';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    // function atualizar() {
    //     let input_id = document.querySelector("#hidden_id");
    //     let input_ano_letivo = document.querySelector("#txtAnoTurma");
    //     let lista_validacao = [];

    //     if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
    //     if(lista_validacao.length == 0){
    //         let obj = {
    //             id: input_id.value,
    //             ano_letivo : input_ano_letivo.value,
    //         }

    //         fetch("/ano_letivo/editar", {
    //             method :"POST",
    //             headers:{
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(obj)
    //         })
    //         .then((resposta) => resposta.json())
    //         .then((dados) => {
    //             if(dados.ok) alert(dados.msg);
    //             window.location.href = '/ano_letivo';
    //         })
    //         .catch((erro) => console.error("erro:", erro));

    //     }else {
    //         validar_campos(lista_validacao);
    //     }
    // }

    // let input_usuario = document.querySelector("#hidden_ano_letivo").value;
    // if (input_usuario == "") 
    // else
    //     document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
    
    document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    document.querySelector("#btn_responder").addEventListener("click", responder);
    document.querySelector("#slctDisciplina").addEventListener("change", verificar_disciplina);
    document.querySelector("#slctTurma").addEventListener("change", verificar_turma);
});