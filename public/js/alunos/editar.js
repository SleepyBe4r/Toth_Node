document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn_editar").addEventListener("click", atualizar);
});

function atualizar(event) {
    
    event.preventDefault(); // Impede o recarregamento da página

    limpar_validacao();

    let inputCPF = document.getElementById("cpf");
    let inputNome = document.getElementById("nome");
    let inputData = document.getElementById("data");
    let inputEmail = document.getElementById("email");
    let inputFone = document.getElementById("fone");
    let inputRua = document.getElementById("rua");
    let inputBairro = document.getElementById("bairro");
    let inputConvenio = document.getElementById("convenio");

    let lista_validacao = [];

    if (inputCPF.value.trim() === "") lista_validacao.push("cpf");
    if (inputNome.value.trim() === "") lista_validacao.push("nome");
    if (inputData.value.trim() === "") lista_validacao.push("data");
    if (inputEmail.value.trim() === "") lista_validacao.push("email");
    if (inputFone.value.trim() === "") lista_validacao.push("fone");
    if (inputRua.value.trim() === "") lista_validacao.push("rua");
    if (inputBairro.value.trim() === "") lista_validacao.push("bairro");
    if (inputConvenio.value.trim() === "") lista_validacao.push("convenio");

    if (lista_validacao.length === 0) {
        let obj = {
            cpf: inputCPF.value,
            nome: inputNome.value,
            data: inputData.value,
            email: inputEmail.value,
            fone: inputFone.value,
            rua: inputRua.value,
            bairro: inputBairro.value,
            convenio: inputConvenio.value
        };

        fetch("/aluno/editar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        })
        .then(resposta => resposta.json())
        .then(corpoResposta => {
            alert(corpoResposta.msg);
            if (corpoResposta.ok) {
                window.location.href = "/admin/alunos";
            } else {
                console.error(corpoResposta.msg);
            }
        })
        .catch(erro => {
            alert("Erro na requisição");
            console.error("Erro:", erro);
        });
    } else {
        validar_campos(lista_validacao);
    }
}