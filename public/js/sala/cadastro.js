
document.addEventListener("DOMContentLoaded", ()=>{

    function cadastrar() {
        let input_sala = document.querySelector("#txtSala");
        let input_qntd_alunos = document.querySelector("#txtQtdeAlunos");
        let lista_validacao = [];

        if (input_sala.value === "") lista_validacao.push(input_sala.id);
        if (input_qntd_alunos.value === "") lista_validacao.push(input_qntd_alunos.id);
        if(lista_validacao.length == 0){
            let obj = {
                sala : input_sala.value,
                qntd_alunos : input_qntd_alunos.value
            }

            fetch("/sala/cadastrar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/sala';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_sala = document.querySelector("#txtSala");
        let input_qntd_alunos = document.querySelector("#txtQtdeAlunos");
        let lista_validacao = [];

        if (input_sala.value === "") lista_validacao.push(input_sala.id);
        if (input_qntd_alunos.value === "") lista_validacao.push(input_qntd_alunos.id);
        if(lista_validacao.length == 0){
            let obj = {
                id : input_id.value,
                sala : input_sala.value,
                qntd_alunos : input_qntd_alunos.value
            }

            fetch("/sala/editar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/sala';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    let input_usuario = document.querySelector("#hidden_sala").value;
    if (input_usuario == "") 
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});