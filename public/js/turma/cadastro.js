
document.addEventListener("DOMContentLoaded", ()=>{

    function cadastrar() {
        let input_turma = document.querySelector("#txtTurma");
        let lista_validacao = [];

        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if(lista_validacao.length == 0){
            let obj = {
                turma : input_turma.value,
            }

            fetch("/turma/cadastrar", {
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
                window.location.href = '/turma';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_turma = document.querySelector("#txtTurma");
        let lista_validacao = [];

        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if(lista_validacao.length == 0){
            let obj = {
                id: input_id.value,
                turma : input_turma.value,
            }

            fetch("/turma/editar", {
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
                window.location.href = '/turma';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    let input_turma = document.querySelector("#hidden_turma").value;
    if (input_turma == "") 
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});