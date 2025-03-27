document.addEventListener("DOMContentLoaded", () =>{
    
    document.getElementById("btn_cadastro").addEventListener("click", cadastrar);
    
    function cadastrar(){
        let inputCPF = document.getElementById("cpf-aluno");
        let inputNome = document.getElementById("nome-aluno");
        let inputData = document.getElementById("data-aluno");
        let inputEmail = document.getElementById("email-aluno");
        let inputFone = document.getElementById("telefone-aluno");
        let inputRua = document.getElementById("rua-aluno");
        let inputBairro = document.getElementById("bairro-aluno");
        let inputConvenio = document.getElementById("convenio-aluno");
        let lista_validacao = [];

        if(inputCPF.value == "")
            lista_validacao.push("cpf-aluno");
        if(inputNome.value == "")
            lista_validacao.push("nome-aluno");
        if(inputData.value == "")
            lista_validacao.push("data-aluno");
        if(inputEmail.value == "")
            lista_validacao.push("email-aluno");
        if(inputFone.value == "")
            lista_validacao.push("telefone-aluno");
        if(inputRua.value == "")
            lista_validacao.push("rua-aluno");
        if(inputBairro.value == "")
            lista_validacao.push("bairro-aluno");
        if(inputConvenio.value == "")
            lista_validacao.push("convenio-aluno");

        if(lista_validacao.length == 0){
            let obj = {
                cpf: inputCPF.value,
                nome: inputNome.value,
                data: inputData.value,
                email: inputEmail.value,
                fone: inputFone.value,
                rua: inputRua.value,
                bairro: inputBairro.value,
                convenio: inputConvenio.value

            }

            fetch("/aluno/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then(function(resposta){
                return resposta.json();
            })
            .then(function(corpoResposta){
                if(corpoResposta.ok){
                    alert(corpoResposta.msg);
                }
                else{
                    console.error(corpoResposta.msg);
                }
            })
            .catch((erro) => console.error("erro:", erro));
        }
        else{
            validar_campos(lista_validacao);
        }
    }
})