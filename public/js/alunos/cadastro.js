document.addEventListener("DOMContentLoaded", () => {
    const inputCPF = document.getElementById("cpf-aluno");
    const inputFone = document.getElementById("telefone-aluno");


    // Máscara para CPF com limite de 14 caracteres
    inputCPF.addEventListener("input", () => {
        let v = inputCPF.value.replace(/\D/g, ""); // só números
        if (v.length > 11) v = v.slice(0, 11); // limita a 11 números (sem pontos/traço)

        if (v.length > 3) v = v.replace(/(\d{3})(\d)/, "$1.$2");
        if (v.length > 6) v = v.replace(/(\d{3})(\d)/, "$1.$2");
        if (v.length > 9) v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        inputCPF.value = v;
    });


    // Máscara para Telefone
    inputFone.addEventListener("input", () => {
        let v = inputFone.value.replace(/\D/g, "");
        if (v.length <= 10) {
            // formato (XX) XXXX-XXXX
            v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else {
            // formato (XX) 9XXXX-XXXX
            v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
        }
        inputFone.value = v;
    });

    // Função para destacar campos obrigatórios não preenchidos
    function validar_campos(lista_ids) {
        lista_ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.borderColor = "red";
                el.focus();
                // Você pode criar uma mensagem de erro aqui, se quiser
            }
        });
    }

    // Função para limpar o destaque dos campos
    function limpar_validacao() {
        const campos = ["cpf-aluno", "nome-aluno", "data-aluno", "email-aluno", "telefone-aluno", "rua-aluno", "bairro-aluno", "convenio-aluno"];
        campos.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.borderColor = "";
            }
        });
    }

    document.getElementById("btn_cadastro").addEventListener("click", cadastrar);
    document.getElementById("btn_editar").addEventListener("click", atualizar);

    function cadastrar() {
        limpar_validacao();

        let inputNome = document.getElementById("nome-aluno");
        let inputData = document.getElementById("data-aluno");
        let inputEmail = document.getElementById("email-aluno");
        let inputRua = document.getElementById("rua-aluno");
        let inputBairro = document.getElementById("bairro-aluno");
        let inputConvenio = document.getElementById("convenio-aluno");

        let lista_validacao = [];

        if (inputCPF.value.trim() === "") lista_validacao.push("cpf-aluno");
        if (inputNome.value.trim() === "") lista_validacao.push("nome-aluno");
        if (inputData.value.trim() === "") lista_validacao.push("data-aluno");
        if (inputEmail.value.trim() === "") lista_validacao.push("email-aluno");
        if (inputFone.value.trim() === "") lista_validacao.push("telefone-aluno");
        if (inputRua.value.trim() === "") lista_validacao.push("rua-aluno");
        if (inputBairro.value.trim() === "") lista_validacao.push("bairro-aluno");
        if (inputConvenio.value.trim() === "") lista_validacao.push("convenio-aluno");

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

            fetch("/aluno/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj)
            })
                .then(resposta => resposta.json())
                .then(corpoResposta => {
                    if (corpoResposta.ok) {
                        alert(corpoResposta.msg);
                        window.location.href = '/aluno';
                    } else {
                        alert("Erro: " + corpoResposta.msg);
                        console.error(corpoResposta.msg);
                    }
                })
                .catch(erro => {
                    alert("Erro na requisição");
                    console.error("erro:", erro);
                });
        } else {
            validar_campos(lista_validacao);
        }
    }
});
