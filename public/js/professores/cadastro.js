/**
 * Arquivo responsável pelo gerenciamento do cadastro de professores
 * Coleta dados do formulário, valida e envia para o backend
 */

document.addEventListener("DOMContentLoaded", () => {
    const botaoCadastro = document.getElementById("btn_cadastro");
    
    if (botaoCadastro) {
        botaoCadastro.addEventListener("click", cadastrarProfessor);
    }
    
    // Configurar formatação automática dos campos
    configurarFormatacao();
    
    function cadastrarProfessor() {
        // Coletar dados dos inputs
        const inputCPF = document.getElementById("cpf");
        const inputNome = document.getElementById("nome");
        const inputEmail = document.getElementById("email");
        const inputDataNascimento = document.getElementById("dt_nascimento");
        const inputRua = document.getElementById("rua");
        const inputBairro = document.getElementById("bairro");
        const inputTelefone = document.getElementById("telefone");
        const inputSenha = document.getElementById("senha");
        const inputTitulacao = document.getElementById("titulacao");
        const inputDataAdmissao = document.getElementById("dt_admissao");
        
        let lista_validacao = [];
        
        // Validar campos obrigatórios
        if (inputCPF.value == "") lista_validacao.push("cpf");
        if (inputNome.value == "") lista_validacao.push("nome");
        if (inputEmail.value == "") lista_validacao.push("email");
        if (inputDataNascimento.value == "") lista_validacao.push("dt_nascimento");
        if (inputRua.value == "") lista_validacao.push("rua");
        if (inputBairro.value == "") lista_validacao.push("bairro");
        if (inputTelefone.value == "") lista_validacao.push("telefone");
        if (inputSenha.value == "") lista_validacao.push("senha");
        if (inputTitulacao.value == "") lista_validacao.push("titulacao");
        if (inputDataAdmissao.value == "") lista_validacao.push("dt_admissao");
        
        if (lista_validacao.length == 0) {
            // Validações específicas usando as funções de validação
            let validacaoEspecifica = [];
            
            // Validar CPF
            if (typeof validarCPF === 'function') {
                const resultadoCPF = validarCPF(inputCPF.value);
                if (!resultadoCPF.valido) {
                    validacaoEspecifica.push({ campo: "cpf", mensagem: resultadoCPF.mensagem });
                }
            }
            
            // Validar Nome
            if (typeof validarNome === 'function') {
                const resultadoNome = validarNome(inputNome.value);
                if (!resultadoNome.valido) {
                    validacaoEspecifica.push({ campo: "nome", mensagem: resultadoNome.mensagem });
                }
            }
            
            // Validar Email
            if (typeof validarEmail === 'function') {
                const resultadoEmail = validarEmail(inputEmail.value);
                if (!resultadoEmail.valido) {
                    validacaoEspecifica.push({ campo: "email", mensagem: resultadoEmail.mensagem });
                }
            }
            
            // Validar Telefone
            if (typeof validarTelefone === 'function') {
                const resultadoTelefone = validarTelefone(inputTelefone.value);
                if (!resultadoTelefone.valido) {
                    validacaoEspecifica.push({ campo: "telefone", mensagem: resultadoTelefone.mensagem });
                }
            }
            
            // Validar Data de Nascimento
            if (typeof validarDataNascimento === 'function') {
                const resultadoDataNascimento = validarDataNascimento(inputDataNascimento.value);
                if (!resultadoDataNascimento.valido) {
                    validacaoEspecifica.push({ campo: "dt_nascimento", mensagem: resultadoDataNascimento.mensagem });
                }
            }
            
            // Validar Senha
            if (typeof validarSenha === 'function') {
                const resultadoSenha = validarSenha(inputSenha.value);
                if (!resultadoSenha.valido) {
                    validacaoEspecifica.push({ campo: "senha", mensagem: resultadoSenha.mensagem });
                }
            }
            
            // Validar Data de Admissão
            if (typeof validarDataAdmissao === 'function') {
                const resultadoDataAdmissao = validarDataAdmissao(inputDataAdmissao.value, inputDataNascimento.value);
                if (!resultadoDataAdmissao.valido) {
                    validacaoEspecifica.push({ campo: "dt_admissao", mensagem: resultadoDataAdmissao.mensagem });
                }
            }
            
            if (validacaoEspecifica.length == 0) {
                // Criar objeto com dados do professor
                const obj = {
                    cpf: inputCPF.value,
                    nome: inputNome.value,
                    email: inputEmail.value,
                    dt_nascimento: inputDataNascimento.value,
                    rua: inputRua.value,
                    bairro: inputBairro.value,
                    telefone: inputTelefone.value,
                    senha: inputSenha.value,
                    titulacao: inputTitulacao.value,
                    dt_admissao: inputDataAdmissao.value
                };
                
                // Enviar dados via fetch
                fetch("/admin/professores/cadastrar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                .then(function(resposta) {
                    return resposta.json();
                })
                .then(function(corpoResposta) {
                    alert(corpoResposta.msg);
                    if (corpoResposta.ok) {
                        // Redirecionar para lista de professores
                        window.location.href = "/admin/professores";
                    }
                })
                .catch((erro) => {
                    console.error("Erro:", erro);
                    alert("Erro ao conectar com o servidor");
                });
            } else {
                // Exibir erros específicos
                exibirErrosEspecificos(validacaoEspecifica);
            }
        } else {
            // Validar campos obrigatórios
            validar_campos(lista_validacao);
        }
    }
    
    function configurarFormatacao() {
        // Formatação de CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                formatarCPF(e.target);
            });
        }

        // Formatação de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                formatarTelefone(e.target);
            });
        }

        // Validação de nome em tempo real
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('input', (e) => {
                validarNomeInput(e.target);
            });
        }

        // Configurar data máxima para data de nascimento (18 anos atrás)
        const dataNascimentoInput = document.getElementById('dt_nascimento');
        if (dataNascimentoInput) {
            const hoje = new Date();
            const dataMinima = new Date();
            dataMinima.setFullYear(hoje.getFullYear() - 18);
            dataNascimentoInput.max = dataMinima.toISOString().split('T')[0];
        }
    }
    
    function exibirErrosEspecificos(erros) {
        // Limpar erros anteriores
        document.querySelectorAll('small[id^="erro-"]').forEach(el => el.textContent = "");
        
        // Exibir novos erros
        erros.forEach(erro => {
            const errorElement = document.getElementById(`erro-${erro.campo}`);
            if (errorElement) {
                errorElement.textContent = erro.mensagem;
            }
        });
        
        alert("Por favor, corrija os erros no formulário antes de continuar.");
    }
    
    function validar_campos(lista) {
        // Implementar validação visual dos campos
        lista.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.classList.add('is-invalid');
            }
        });
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
    
    // Formatadores
    function formatarCPF(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
        }
        
        input.value = value;
    }

    function formatarTelefone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
        }
        
        input.value = value;
    }

    function validarNomeInput(input) {
        let value = input.value;
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) {
            input.value = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
        }
    }
});
