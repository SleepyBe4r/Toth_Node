/**
 * Arquivo responsável pelo gerenciamento do cadastro de professores
 * Coleta dados do formulário, valida e envia para o backend
 */

class CadastroProfessor {
    
    constructor() {
        this.formulario = null;
        this.botaoSubmit = null;
        this.init();
    }

    /**
     * Inicializa os eventos e configurações
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.formulario = document.getElementById('formCadastroProfessor');
            this.botaoSubmit = this.formulario?.querySelector('button[type="submit"]');
            
            if (this.formulario) {
                this.configurarEventos();
                this.configurarFormatacao();
            }
        });
    }

    /**
     * Configura os eventos do formulário
     */
    configurarEventos() {
        // Evento de submit do formulário
        this.formulario.addEventListener('submit', (event) => {
            this.processarCadastro(event);
        });

        // Evento de reset do formulário
        this.formulario.addEventListener('reset', () => {
            this.limparValidacoes();
        });
    }

    /**
     * Configura formatação automática dos campos
     */
    configurarFormatacao() {
        // Formatação de CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                this.formatarCPF(e.target);
            });
        }

        // Formatação de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                this.formatarTelefone(e.target);
            });
        }

        // Validação de nome em tempo real
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('input', (e) => {
                this.validarNomeInput(e.target);
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

    /**
     * Coleta todos os dados do formulário
     * @returns {Object} Objeto com todos os dados do formulário
     */
    coletarDadosFormulario() {
        if (!this.formulario) return null;

        const formData = new FormData(this.formulario);
        const dados = {};

        // Converter FormData para objeto JavaScript
        for (let [key, value] of formData.entries()) {
            dados[key] = typeof value === 'string' ? value.trim() : value;
        }

        return dados;
    }

    /**
     * Valida todos os campos obrigatórios
     * @param {Object} dados - Dados do formulário
     * @returns {Object} Resultado da validação
     */
    validarFormulario(dados) {
        const erros = {};
        let isValid = true;

        // Validar campos obrigatórios
        const camposObrigatorios = [
            { campo: 'cpf', nome: 'CPF' },
            { campo: 'nome', nome: 'Nome' },
            { campo: 'email', nome: 'E-mail' },
            { campo: 'dt_nascimento', nome: 'Data de nascimento' },
            { campo: 'rua', nome: 'Rua' },
            { campo: 'bairro', nome: 'Bairro' },
            { campo: 'telefone', nome: 'Telefone' },
            { campo: 'senha', nome: 'Senha' },
            { campo: 'titulacao', nome: 'Titulação' },
            { campo: 'dt_admissao', nome: 'Data de admissão' }
        ];

        // Verificar se todos os campos obrigatórios estão preenchidos
        camposObrigatorios.forEach(({ campo, nome }) => {
            if (!dados[campo] || dados[campo] === '') {
                erros[campo] = `${nome} é obrigatório`;
                isValid = false;
            }
        });

        // Se campos obrigatórios não estão preenchidos, retornar erros básicos
        if (!isValid) {
            return { valido: false, erros };
        }

        // Validações específicas usando as funções do arquivo de validações
        if (typeof validarCPF === 'function') {
            const resultadoCPF = validarCPF(dados.cpf);
            if (!resultadoCPF.valido) {
                erros.cpf = resultadoCPF.mensagem;
                isValid = false;
            }
        }

        if (typeof validarNome === 'function') {
            const resultadoNome = validarNome(dados.nome);
            if (!resultadoNome.valido) {
                erros.nome = resultadoNome.mensagem;
                isValid = false;
            }
        }

        if (typeof validarEmail === 'function') {
            const resultadoEmail = validarEmail(dados.email);
            if (!resultadoEmail.valido) {
                erros.email = resultadoEmail.mensagem;
                isValid = false;
            }
        }

        if (typeof validarTelefone === 'function') {
            const resultadoTelefone = validarTelefone(dados.telefone);
            if (!resultadoTelefone.valido) {
                erros.telefone = resultadoTelefone.mensagem;
                isValid = false;
            }
        }

        if (typeof validarDataNascimento === 'function') {
            const resultadoDataNascimento = validarDataNascimento(dados.dt_nascimento);
            if (!resultadoDataNascimento.valido) {
                erros.dt_nascimento = resultadoDataNascimento.mensagem;
                isValid = false;
            }
        }

        if (typeof validarSenha === 'function') {
            const resultadoSenha = validarSenha(dados.senha);
            if (!resultadoSenha.valido) {
                erros.senha = resultadoSenha.mensagem;
                isValid = false;
            }
        }

        if (typeof validarDataAdmissao === 'function' && dados.dt_nascimento && dados.dt_admissao) {
            const resultadoDataAdmissao = validarDataAdmissao(dados.dt_admissao, dados.dt_nascimento);
            if (!resultadoDataAdmissao.valido) {
                erros.dt_admissao = resultadoDataAdmissao.mensagem;
                isValid = false;
            }
        }

        return { valido: isValid, erros };
    }

    /**
     * Exibe erros de validação no formulário
     * @param {Object} erros - Objeto com os erros de validação
     */
    exibirErros(erros) {
        // Limpar erros anteriores
        this.limparValidacoes();

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
    limparValidacoes() {
        const campos = ['cpf', 'nome', 'email', 'dt_nascimento', 'rua', 'bairro', 'telefone', 'senha', 'titulacao', 'dt_admissao'];
        
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

        // Limpar mensagem de erro geral
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    /**
     * Marca campos válidos visualmente
     * @param {Object} dados - Dados do formulário
     * @param {Object} erros - Erros de validação
     */
    marcarCamposValidos(dados, erros) {
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
    async enviarDados(dados) {
        try {
            const response = await fetch('/admin/professores/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            // Verificar se a resposta foi bem-sucedida
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
     * Exibe loading no botão de submit
     * @param {boolean} mostrar - Se deve mostrar ou esconder o loading
     */
    toggleLoading(mostrar) {
        if (!this.botaoSubmit) return;

        if (mostrar) {
            this.botaoSubmit.originalText = this.botaoSubmit.innerHTML;
            this.botaoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
            this.botaoSubmit.disabled = true;
        } else {
            this.botaoSubmit.innerHTML = this.botaoSubmit.originalText || '<i class="fas fa-save"></i> Cadastrar';
            this.botaoSubmit.disabled = false;
        }
    }

    /**
     * Exibe mensagem de sucesso
     * @param {string} mensagem - Mensagem de sucesso
     */
    exibirSucesso(mensagem) {
        // Atualizar modal de sucesso
        const modalLabel = document.getElementById('feedbackModalLabel');
        const modalBody = document.getElementById('feedbackModalBody');

        if (modalLabel && modalBody) {
            modalLabel.textContent = 'Sucesso!';
            modalBody.innerHTML = `
                <div class="text-success text-center">
                    <i class="fas fa-check-circle fa-3x mb-3 text-success"></i>
                    <h5 class="text-success">${mensagem}</h5>
                    <p class="text-muted">Você será redirecionado automaticamente...</p>
                </div>
            `;

            // Mostrar modal (usando Bootstrap)
            if (typeof $ !== 'undefined' && $.fn.modal) {
                $('#feedbackModal').modal('show');
                
                // Redirecionar após fechar o modal
                $('#feedbackModal').on('hidden.bs.modal', () => {
                    window.location.href = '/admin/professores';
                });
            } else {
                // Fallback se Bootstrap não estiver disponível
                alert(mensagem);
                window.location.href = '/admin/professores';
            }
        }
    }

    /**
     * Exibe mensagem de erro
     * @param {string} mensagem - Mensagem de erro
     */
    exibirErroGeral(mensagem) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> ${mensagem}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
            errorDiv.style.display = 'block';
            
            // Scroll para o erro
            errorDiv.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback
            alert('Erro: ' + mensagem);
        }
    }

    /**
     * Função principal que processa o cadastro
     * @param {Event} event - Evento de submit do formulário
     */
    async processarCadastro(event) {
        event.preventDefault();

        try {
            // 1. Coletar dados do formulário
            const dados = this.coletarDadosFormulario();
            
            if (!dados) {
                this.exibirErroGeral('Erro ao coletar dados do formulário');
                return;
            }

            console.log('Dados coletados:', dados);

            // 2. Validar dados
            const validacao = this.validarFormulario(dados);
            
            if (!validacao.valido) {
                this.exibirErros(validacao.erros);
                this.exibirErroGeral('Por favor, corrija os erros no formulário antes de continuar.');
                return;
            }

            // 3. Marcar campos válidos
            this.marcarCamposValidos(dados, {});

            // 4. Mostrar loading
            this.toggleLoading(true);

            // 5. Enviar dados para o backend
            const resultado = await this.enviarDados(dados);

            // 6. Processar resposta
            if (resultado.ok) {
                this.exibirSucesso(resultado.msg || 'Professor cadastrado com sucesso!');
            } else {
                this.exibirErroGeral(resultado.msg || 'Erro ao cadastrar professor');
            }

        } catch (error) {
            console.error('Erro no processamento:', error);
            this.exibirErroGeral(error.message || 'Erro inesperado ao processar cadastro');
        } finally {
            // 7. Esconder loading
            this.toggleLoading(false);
        }
    }

    /**
     * Formatadores - métodos auxiliares
     */
    formatarCPF(input) {
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

    formatarTelefone(input) {
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

    validarNomeInput(input) {
        let value = input.value;
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) {
            input.value = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
        }
    }
}

// Instanciar a classe quando o arquivo for carregado
const cadastroProfessor = new CadastroProfessor();

// Disponibilizar globalmente
window.CadastroProfessor = CadastroProfessor;
