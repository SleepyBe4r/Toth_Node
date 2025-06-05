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

    function corrigir() {
        let input_nota_hidden = document.querySelector("#slctNota_hidden");
        let lista_validacao = [];
        
        let lista_id_nota = []
        for (let i = 0; i < input_nota_hidden.options.length; i++) {
            lista_id_nota.push(parseInt(input_nota_hidden.options[i].value));            
        }

        let lista_notas = [];
        for (let i = 0; i < lista_id_nota.length; i++) {
            let input_nota = document.querySelector(`#txtNota_${lista_id_nota[i]}`);
            let input_feedback = document.querySelector(`#txtFeedback_${lista_id_nota[i]}`);

            if (input_nota && input_nota.value !== "") {
                if (input_feedback && input_feedback.value !== "") {
                    lista_notas.push({
                        id_nota: lista_id_nota[i],
                        nota: input_nota.value,
                        feedback: input_feedback.value
                    });                    
                } else {
                    lista_validacao.push(input_feedback.id)

                }
            } else {
                lista_validacao.push(input_nota.id)
            }
        }        

        if(lista_validacao.length == 0){
             

            fetch("/atividade/corrigir", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lista_notas)
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


    function exportarExcel() {
        var wb = XLSX.utils.table_to_book(document.getElementById("tabelaNotas"));
        /* Export to file (start a download) */
        XLSX.writeFile(wb, "notas.xlsx");
    }


    let usuario = document.querySelector("#hidden_usuario").value;
    if(usuario == "A"){
        document.querySelector("#btn_resposta").addEventListener("click", responder);    
    } else if(usuario == "P"){
        document.getElementById("btn-exportar").addEventListener("click", exportarExcel);
        document.querySelector("#btn_corrigir").addEventListener("click", corrigir);    
    }
});