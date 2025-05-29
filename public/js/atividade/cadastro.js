
document.addEventListener("DOMContentLoaded", ()=>{

    function cadastrar() {
        let input_nome = document.querySelector("#txtNomeAtividade");
        let input_descricao = document.querySelector("#txtDescricao");
        let input_dt_inicial = document.querySelector("#dtInicial");
        let input_dt_final = document.querySelector("#dtFinal");
        let lista_validacao = [];

        if (input_nome.value === "") lista_validacao.push(input_nome.id);
        if (input_descricao.value === "") lista_validacao.push(input_descricao.id);
        if (input_dt_inicial.value === "") lista_validacao.push(input_dt_inicial.id);
        if (input_dt_final.value === "") lista_validacao.push(input_dt_final.id);
    
        if(!validarDatas(input_dt_inicial, input_dt_final, document.querySelector("#erro_dt")))
            return;

        if(lista_validacao.length == 0){
            let obj = {
                nome : input_nome.value,
                descricao : input_descricao.value,
                dt_inicial : input_dt_inicial.value,
                dt_final : input_dt_final.value
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

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_nome = document.querySelector("#txtNomeAtividade");
        let input_descricao = document.querySelector("#txtDescricao");
        let input_dt_inicial = document.querySelector("#dtInicial");
        let input_dt_final = document.querySelector("#dtFinal");
        let lista_validacao = [];

        if (input_nome.value === "") lista_validacao.push(input_nome.id);
        if (input_descricao.value === "") lista_validacao.push(input_descricao.id);
        if (input_dt_inicial.value === "") lista_validacao.push(input_dt_inicial.id);
        if (input_dt_final.value === "") lista_validacao.push(input_dt_final.id);
    
        if(!validarDatas(input_dt_inicial, input_dt_final, document.querySelector("#erro_dt")))
            return;

        if(lista_validacao.length == 0){
            let obj = {
                id: input_id.value,
                nome : input_nome.value,
                descricao : input_descricao.value,
                dt_inicial : input_dt_inicial.value,
                dt_final : input_dt_final.value
            }

            fetch("/atividade/editar", {
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
    
    let input_usuario = document.querySelector("#hidden_atividade").value;
    if (input_usuario == "") 
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});