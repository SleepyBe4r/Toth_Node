/**
 * Arquivo responsável pelo gerenciamento da edição de professores
 * Coleta dados do formulário, valida e envia para o backend
 */

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById('formEditarProfessor');
    const telefoneInput = document.getElementById('telefone');
    const nomeInput = document.getElementById('nome');
    
    if (formulario) {
        configurarEventos();
        configurarFormatacao();
    }
    
    /**
     * Configura os eventos do formulário
     */
    function configurarEventos() {
        formulario.addEventListener('submit', processarEdicao);
    }
    
    /**
     * Configura formatação automática dos campos
     */
    function configurarFormatacao() {
        // Formatação de telefone
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                formatarTelefone(e.target);
            });
        }
        
        // Validação de nome em tempo real
        if (nomeInput) {
            nomeInput.addEventListener('input', (e) => {
                validarNomeInput(e.target);
            });
        }
    }
    
    /**
     * Coleta todos os dados do formulário
     * @returns {Object} Objeto com todos os dados do formulário
     */
    function coletarDadosFormulario() {
        const formData = new FormData(formulario);
        const dados = {};
        
        // Converter FormData para objeto JavaScript
        for (let [key, value] of formData.entries()) {
            dados[key] = typeof value === 'string' ? value.trim() : value;
        }
        
        return dados;
    }
    
    /**
     * Valida todos os campos do formulário
     * @param {Object} dados - Dados do formulário
     * @returns {Object} Resultado da validação
     */
    function validarFormulario(dados) {
        const erros = {};
        let isValid = true;
        
        // Validar campos obrigatórios
        const camposObrigatorios = [
            { campo: 'nome', nome: 'Nome' },
            { campo: 'email', nome: 'E-mail' },
            { campo: 'telefone', nome: 'Telefone' },
            { campo: 'titulacao', nome: 'Titulação' }
        ];
        
        // Verificar se todos os campos obrigatórios estão preenchidos
        camposObrigatorios.forEach(({ campo, nome }) => {
            if (!dados[campo] || dados[campo] === '') {
                erros[campo] = `${nome} é obrigatório`;
                isValid = false;
            }
        });
        
        // Validações específicas
        if (dados.nome && dados.nome.length < 2) {
            erros.nome = 'Nome deve ter pelo menos 2 caracteres';
            isValid = false;
        }
        
        if (dados.email && !validarEmail(dados.email)) {
            erros.email = 'E-mail inválido';
            isValid = false;
        }
        
        if (dados.telefone && !validarTelefone(dados.telefone)) {
            erros.telefone = 'Telefone inválido';
            isValid = false;
        }
        
        return { valido: isValid, erros };
    }
    
    /**
     * Valida formato de email
     * @param {string} email 
     * @returns {boolean}
     */
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Valida formato de telefone
     * @param {string} telefone 
     * @returns {boolean}
     */
    function validarTelefone(telefone) {
        const apenasNumeros = telefone.replace(/\D/g, '');
        return apenasNumeros.length === 10 || apenasNumeros.length === 11;
    }
    
    /**
     * Exibe erros de validação no formulário
     * @param {Object} erros - Objeto com os erros de validação
     */
    function exibirErros(erros) {
        // Limpar erros anteriores
        limparValidacoes();
        
        // Exibir novos erros
        Object.keys(erros).forEach(campo => {
            const inputElement = document.getElementById(campo);
            const errorElement = document.getElementById(`erro-${campo}`);
            
            if (inputElement) {
                inputElement.classList.add('is-invalid');
                inputElement.classList.remove('is-valid');
            }
            
            if (errorElement) {
                errorElement.textContent = erros[campo];
            }
        });
        
        // Scroll para o primeiro erro
        const primeiroErro = Object.keys(erros)[0];
        if (primeiroErro) {
            const elemento = document.getElementById(primeiroErro);
            if (elemento) {
                elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    
    /**
     * Limpa todas as validações visuais do formulário
     */
    function limparValidacoes() {
        const campos = ['nome', 'email', 'telefone', 'titulacao'];
        
        campos.forEach(campo => {
            const inputElement = document.getElementById(campo);
            const errorElement = document.getElementById(`erro-${campo}`);
            
            if (inputElement) {
                inputElement.classList.remove('is-invalid', 'is-valid');
            }
            
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
    
    /**
     * Marca campos válidos visualmente
     * @param {Object} dados - Dados do formulário
     * @param {Object} erros - Erros de validação
     */
    function marcarCamposValidos(dados, erros) {
        Object.keys(dados).forEach(campo => {
            if (!erros[campo] && dados[campo]) {
                const inputElement = document.getElementById(campo);
                if (inputElement) {
                    inputElement.classList.add('is-valid');
                    inputElement.classList.remove('is-invalid');
                }
            }
        });
    }
    
    /**
     * Envia os dados para o backend via fetch
     * @param {Object} dados - Dados do formulário validados
     * @returns {Promise} Promise com o resultado do envio
     */
    async function enviarDados(dados) {
        try {
            const response = await fetch('/admin/professores/editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const result = await response.json();
            return result;
            
        } catch (error) {
            console.error('Erro no fetch:', error);
            throw new Error(`Erro ao conectar com o servidor: ${error.message}`);
        }
    }
    
    /**
     * Função principal que processa a edição
     * @param {Event} event - Evento de submit do formulário
     */
    async function processarEdicao(event) {
        event.preventDefault();
        
        try {
            // 1. Coletar dados do formulário
            const dados = coletarDadosFormulario();
            
            console.log('Dados coletados:', dados);
            
            // 2. Validar dados
            const validacao = validarFormulario(dados);
            
            if (!validacao.valido) {
                exibirErros(validacao.erros);
                alert('Por favor, corrija os erros no formulário antes de continuar.');
                return;
            }
            
            // 3. Marcar campos válidos
            marcarCamposValidos(dados, {});
            
            // 4. Enviar dados para o backend
            const resultado = await enviarDados(dados);
            
            // 5. Processar resposta
            if (resultado.ok) {
                alert(resultado.msg || 'Professor editado com sucesso!');
                window.location.href = '/admin/professores';
            } else {
                alert(resultado.msg || 'Erro ao editar professor');
            }
            
        } catch (error) {
            console.error('Erro no processamento:', error);
            alert(error.message || 'Erro inesperado ao processar edição');
        }
    }
    
    /**
     * Formatadores - métodos auxiliares
     */
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
            const errorElement = document.getElementById('erro-nome');
            if (errorElement) {
                errorElement.textContent = 'Nome deve conter apenas letras e espaços';
            }
        } else {
            const errorElement = document.getElementById('erro-nome');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }
});
