
document.addEventListener("DOMContentLoaded", ()=>{

    function cadastrar() {
        let input_ano_letivo = document.querySelector("#txtAno");
        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if(lista_validacao.length == 0){
            let obj = {
                ano_letivo : input_ano_letivo.value,
            }

            fetch("/ano_letivo/cadastrar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                alert(dados.msg);
                if(dados.ok) 
                window.location.href = '/ano_letivo';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_ano_letivo = document.querySelector("#txtAno");
        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if(lista_validacao.length == 0){
            let obj = {
                id: input_id.value,
                ano_letivo : input_ano_letivo.value,
            }

            fetch("/ano_letivo/editar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                alert(dados.msg);
                if(dados.ok) 
                window.location.href = '/ano_letivo';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    let input_usuario = document.querySelector("#hidden_ano_letivo").value;
    if (input_usuario == "") 
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});