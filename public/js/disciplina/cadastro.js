
document.addEventListener("DOMContentLoaded", ()=>{

    function cadastrar() {
        let input_nome_disc = document.querySelector("#txtNome");
        let input_carga_horaria = document.querySelector("#txtCargaHoraria");
        let lista_validacao = [];

        if (input_nome_disc.value === "") lista_validacao.push(input_nome_disc.id);
        if (input_carga_horaria.value === "0") lista_validacao.push(input_carga_horaria.id);
        if(lista_validacao.length == 0){
            let obj = {
                nome : input_nome_disc.value,
                carga_horaria: input_carga_horaria.value
            }

            fetch("/disciplina/cadastrar", {
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
                window.location.href = '/disciplina';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_nome_disc = document.querySelector("#txtNome");
        let input_carga_horaria = document.querySelector("#txtCargaHoraria");
        let lista_validacao = [];

        if (input_nome_disc.value === "") lista_validacao.push(input_nome_disc.id);
        if (input_carga_horaria.value === "0") lista_validacao.push(input_carga_horaria.id);
        if(lista_validacao.length == 0){
            let obj = {
                id: input_id.value,
                nome : input_nome_disc.value,
                carga_horaria: input_carga_horaria.value
            }

            fetch("/disciplina/editar", {
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
                window.location.href = '/disciplina';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    let input_disciplina = document.querySelector("#hidden_disciplina").value;
    if (input_disciplina == "") 
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});