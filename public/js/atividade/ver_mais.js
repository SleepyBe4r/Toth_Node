document.addEventListener("DOMContentLoaded", ()=>{

    function responder() {
        let input_id_A = document.querySelector("#hidden_id_nota");
        let input_resposta = document.querySelector("#inputResposta");
        let arquivo = input_resposta.files[0];
        let ext = arquivo.type.split("/").pop();
        let lista_validacao = [];

        if (input_resposta.value == "") lista_validacao.push(input_resposta.id);
        if( ext == "pdf" || ext == "doc" || ext == "docx" || ext == "txt"){
            
        }else{
            alert("Selecione um arquivo com o formato correto! (pdf/doc/docx/txt)");
            lista_validacao.push(input_resposta.id)
        }

        if(lista_validacao.length == 0){
            let form = new FormData();
            
            form.set("id_atividade", input_id_A.value);
            form.set("resposta", arquivo);
            form.set("resposta_extencao", ext);
            

            fetch("/atividade/responder", {
                method :"POST",
                body: form
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

    document.querySelector("#btn_resposta").addEventListener("click", responder);    
});