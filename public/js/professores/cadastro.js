/**
 * Arquivo consolidado responsável pelo cadastro de professores
 * Funciona tanto para área administrativa quanto área do professor
 * Validações movidas para o backend
 */

document.addEventListener("DOMContentLoaded", () => {
    // Detectar contexto (admin ou professor) baseado na URL ou elementos
    const isAdminArea = window.location.pathname.includes('/admin/') || document.getElementById("btn_cadastro");
    const isProfessorArea = document.getElementById("professorForm");
    
    if (isAdminArea) {
        inicializarCadastroAdmin();
    } else if (isProfessorArea) {
        inicializarCadastroProfessor();
    }
    
    /**
     * Inicializar cadastro na área administrativa
     */
    function inicializarCadastroAdmin() {
        const botaoCadastro = document.getElementById("btn_cadastro");
        
        if (botaoCadastro) {
            botaoCadastro.addEventListener("click", cadastrarProfessorAdmin);
        }
        
        // Configurar formatação automática dos campos
        configurarFormatacao();
    }
    
    /**
     * Inicializar cadastro na área do professor
     */
    function inicializarCadastroProfessor() {
        const formProfessor = document.getElementById("professorForm");
        
        if (formProfessor) {
            formProfessor.addEventListener("submit", cadastrarProfessorAreaProfessor);
        }
        
        // Configurar formatação automática dos campos
        configurarFormatacao();
    }
      /**
     * Cadastrar professor na área administrativa
     */
    function cadastrarProfessorAdmin() {
        // Limpar erros anteriores
        limparTodosOsErros();
        
        // Coletar dados dos inputs
        const dadosFormulario = coletarDadosFormularioAdmin();
        
        // Validação completa no frontend
        const errosValidacao = validarTodosOsCampos(dadosFormulario);
        
        if (errosValidacao.length > 0) {
            // Mostrar primeiro erro encontrado
            alert("Por favor, corrija os erros no formulário antes de continuar.");
            return;
        }
        
        // Enviar para backend (validações robustas no servidor)
        enviarDadosParaBackend(dadosFormulario, "/admin/professores/cadastrar", "/admin/professores");
    }
      /**
     * Cadastrar professor na área do professor
     */
    function cadastrarProfessorAreaProfessor(event) {
        event.preventDefault();
        
        // Limpar erros anteriores
        limparTodosOsErros();
        
        const dadosFormulario = coletarDadosFormularioProfessor();
        
        // Validação completa no frontend
        const errosValidacao = validarTodosOsCampos(dadosFormulario);
        
        if (errosValidacao.length > 0) {
            // Mostrar primeiro erro encontrado
            alert("Por favor, corrija os erros no formulário antes de continuar.");
            return;
        }
        
        // Enviar para backend
        enviarDadosParaBackend(dadosFormulario, "/professor/cadastrar", "/professor/home");
    }
    
    /**
     * Coletar dados do formulário da área administrativa
     */
    function coletarDadosFormularioAdmin() {
        return {
            cpf: document.getElementById("cpf")?.value || "",
            nome: document.getElementById("nome")?.value || "",
            email: document.getElementById("email")?.value || "",
            dt_nascimento: document.getElementById("dt_nascimento")?.value || "",
            rua: document.getElementById("rua")?.value || "",
            bairro: document.getElementById("bairro")?.value || "",
            telefone: document.getElementById("telefone")?.value || "",
            senha: document.getElementById("senha")?.value || "",
            titulacao: document.getElementById("titulacao")?.value || "",
            dt_admissao: document.getElementById("dt_admissao")?.value || ""
        };
    }
    
    /**
     * Coletar dados do formulário da área do professor
     */
    function coletarDadosFormularioProfessor() {
        return {
            cpf: document.getElementById("cpf")?.value || "",
            nome: document.getElementById("nome")?.value || "",
            email: document.getElementById("email")?.value || "",
            dt_nascimento: document.getElementById("dt_nascimento")?.value || "",
            rua: document.getElementById("rua")?.value || "",
            bairro: document.getElementById("bairro")?.value || "",
            telefone: document.getElementById("telefone")?.value || "",
            senha: document.getElementById("senha")?.value || "",
            titulacao: document.getElementById("titulacao")?.value || "",
            dt_admissao: document.getElementById("dt_admissao")?.value || ""
        };
    }
      /**
     * Validar todos os campos do formulário
     */
    function validarTodosOsCampos(dados) {
        const erros = [];
        
        // Verificar campos obrigatórios vazios
        const camposObrigatorios = ['cpf', 'nome', 'email', 'dt_nascimento', 'rua', 'bairro', 'telefone', 'senha', 'titulacao', 'dt_admissao'];
        
        camposObrigatorios.forEach(campo => {
            if (!dados[campo] || dados[campo].trim() === "") {
                mostrarErro(campo, 'Este campo é obrigatório');
                erros.push(`${campo} é obrigatório`);
            }
        });
        
        // Se há campos vazios, não fazer outras validações
        if (erros.length > 0) {
            return erros;
        }
        
        // Validações específicas
        const cpfLimpo = dados.cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11 || !validarDigitosCPF(cpfLimpo)) {
            mostrarErro('cpf', 'CPF inválido');
            erros.push('CPF inválido');
        }
        
        const palavrasNome = dados.nome.trim().split(' ').filter(p => p.length > 0);
        if (palavrasNome.length < 2) {
            mostrarErro('nome', 'Digite nome e sobrenome');
            erros.push('Nome incompleto');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dados.email)) {
            mostrarErro('email', 'Digite um email válido');
            erros.push('Email inválido');
        }
        
        if (dados.senha.length < 6) {
            mostrarErro('senha', 'Senha deve ter pelo menos 6 caracteres');
            erros.push('Senha muito curta');
        }
        
        const telefoneLimpo = dados.telefone.replace(/\D/g, '');
        if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
            mostrarErro('telefone', 'Telefone inválido');
            erros.push('Telefone inválido');
        }
        
        // Validar idade
        const dataNascimento = new Date(dados.dt_nascimento);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();
        if (idade < 18) {
            mostrarErro('dt_nascimento', 'Professor deve ter pelo menos 18 anos');
            erros.push('Idade insuficiente');
        }
        
        // Validar data de admissão
        const dataAdmissao = new Date(dados.dt_admissao);
        if (dataAdmissao > hoje) {
            mostrarErro('dt_admissao', 'Data de admissão não pode ser futura');
            erros.push('Data de admissão inválida');
        }
        
        return erros;
    }
    
    /**
     * Limpar todas as mensagens de erro
     */
    function limparTodosOsErros() {
        document.querySelectorAll('[id^="erro-"]').forEach(el => el.textContent = '');
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }
    
    /**
     * Validar campos obrigatórios da área administrativa
     */
    function validarCamposObrigatoriosAdmin(dados) {
        const camposVazios = [];
        const camposObrigatorios = ['cpf', 'nome', 'email', 'dt_nascimento', 'rua', 'bairro', 'telefone', 'senha', 'titulacao', 'dt_admissao'];
        
        camposObrigatorios.forEach(campo => {
            if (!dados[campo] || dados[campo].trim() === "") {
                camposVazios.push(campo);
            }
        });
        
        return camposVazios;
    }
    
    /**
     * Validar campos obrigatórios da área do professor
     */
    function validarCamposObrigatoriosProfessor(dados) {
        const camposVazios = [];
        const camposObrigatorios = ['cpf', 'nome', 'email', 'dt_nascimento', 'rua', 'bairro', 'telefone', 'senha', 'titulacao', 'dt_admissao'];
        
        camposObrigatorios.forEach(campo => {
            if (!dados[campo] || dados[campo].trim() === "") {
                camposVazios.push(campo);
            }
        });
        
        return camposVazios;
    }
      /**
     * Destacar campos vazios visualmente
     */
    function destacarCamposVazios(campos) {
        // Limpar destaques anteriores
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('[id^="erro-"]').forEach(el => el.textContent = '');
        
        // Destacar campos vazios
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.classList.add('is-invalid');
                mostrarErro(campo, 'Este campo é obrigatório');
            }
        });
    }
      /**
     * Enviar dados para o backend
     */
    function enviarDadosParaBackend(dados, endpoint, redirectUrl) {
        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(resultado => {
            if (resultado.ok) {
                alert(resultado.msg);
                window.location.href = redirectUrl;
            } else {
                // Se o backend retornou erros específicos, mostrá-los
                if (resultado.erros && Array.isArray(resultado.erros)) {
                    // Limpar erros anteriores
                    limparTodosOsErros();
                    
                    // Mostrar cada erro específico
                    resultado.erros.forEach(erro => {
                        if (erro.campo && erro.mensagem) {
                            mostrarErro(erro.campo, erro.mensagem);
                        }
                    });
                    
                    alert("Por favor, corrija os erros indicados no formulário.");
                } else {
                    alert(resultado.msg || "Erro ao cadastrar professor");
                }
            }
        })
        .catch(erro => {
            console.error("Erro:", erro);
            alert("Erro ao conectar com o servidor");
        });
    }
      /**
     * Configurar formatação automática dos campos e validação em tempo real
     */
    function configurarFormatacao() {
        // Formatação de CPF + validação em tempo real
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', formatarCPF);
            cpfInput.addEventListener('blur', validarCPFTempoReal);
        }

        // Formatação de telefone + validação em tempo real
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', formatarTelefone);
            telefoneInput.addEventListener('blur', validarTelefoneTempoReal);
        }

        // Validação de nome em tempo real
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('input', validarNomeInput);
            nomeInput.addEventListener('blur', validarNomeTempoReal);
        }

        // Validação de email em tempo real
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', validarEmailTempoReal);
        }

        // Validação de senha em tempo real
        const senhaInput = document.getElementById('senha');
        if (senhaInput) {
            senhaInput.addEventListener('input', validarSenhaTempoReal);
        }

        // Configurar data máxima para data de nascimento (18 anos atrás)
        const dataNascimentoInput = document.getElementById('dt_nascimento');
        if (dataNascimentoInput) {
            const hoje = new Date();
            const dataMinima = new Date();
            dataMinima.setFullYear(hoje.getFullYear() - 18);
            dataNascimentoInput.max = dataMinima.toISOString().split('T')[0];
            dataNascimentoInput.addEventListener('blur', validarDataNascimentoTempoReal);
        }

        // Validação de data de admissão em tempo real
        const dataAdmissaoInput = document.getElementById('dt_admissao');
        if (dataAdmissaoInput) {
            dataAdmissaoInput.addEventListener('blur', validarDataAdmissaoTempoReal);
        }

        // Validação de titulação em tempo real
        const titulacaoInput = document.getElementById('titulacao');
        if (titulacaoInput) {
            titulacaoInput.addEventListener('change', validarTitulacaoTempoReal);
        }

        // Validação de rua em tempo real
        const ruaInput = document.getElementById('rua');
        if (ruaInput) {
            ruaInput.addEventListener('blur', validarRuaTempoReal);
        }

        // Validação de bairro em tempo real
        const bairroInput = document.getElementById('bairro');
        if (bairroInput) {
            bairroInput.addEventListener('blur', validarBairroTempoReal);
        }
    }    
    // ========== FUNÇÕES DE VALIDAÇÃO EM TEMPO REAL ==========
    
    /**
     * Validar CPF em tempo real
     */
    function validarCPFTempoReal() {
        const cpfInput = document.getElementById('cpf');
        const erroElement = document.getElementById('erro-cpf');
        
        if (!cpfInput || !erroElement) return;
        
        const cpf = cpfInput.value.replace(/\D/g, '');
        
        // Limpar erro se campo estiver vazio
        if (cpf === '') {
            erroElement.textContent = '';
            cpfInput.classList.remove('is-invalid');
            return;
        }
        
        // Validar formato e dígitos
        if (cpf.length !== 11) {
            mostrarErro('cpf', 'CPF deve ter 11 dígitos');
            return;
        }
        
        if (!validarDigitosCPF(cpf)) {
            mostrarErro('cpf', 'CPF inválido');
            return;
        }
        
        // CPF válido
        limparErro('cpf');
    }
    
    /**
     * Validar dígitos verificadores do CPF
     */
    function validarDigitosCPF(cpf) {
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        
        // Calcular primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = soma % 11;
        let digito1 = resto < 2 ? 0 : 11 - resto;
        
        if (parseInt(cpf.charAt(9)) !== digito1) {
            return false;
        }
        
        // Calcular segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = soma % 11;
        let digito2 = resto < 2 ? 0 : 11 - resto;
        
        return parseInt(cpf.charAt(10)) === digito2;
    }
    
    /**
     * Validar nome em tempo real
     */
    function validarNomeTempoReal() {
        const nomeInput = document.getElementById('nome');
        const nome = nomeInput?.value.trim();
        
        if (!nome) {
            limparErro('nome');
            return;
        }
        
        if (nome.length < 2) {
            mostrarErro('nome', 'Nome deve ter pelo menos 2 caracteres');
            return;
        }
        
        if (nome.length > 100) {
            mostrarErro('nome', 'Nome deve ter no máximo 100 caracteres');
            return;
        }
        
        // Verificar se contém apenas letras e espaços
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
            mostrarErro('nome', 'Nome deve conter apenas letras');
            return;
        }
        
        // Verificar se tem pelo menos nome e sobrenome
        const palavras = nome.split(' ').filter(p => p.length > 0);
        if (palavras.length < 2) {
            mostrarErro('nome', 'Digite nome e sobrenome');
            return;
        }
        
        limparErro('nome');
    }
    
    /**
     * Validar email em tempo real
     */
    function validarEmailTempoReal() {
        const emailInput = document.getElementById('email');
        const email = emailInput?.value.trim();
        
        if (!email) {
            limparErro('email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarErro('email', 'Digite um email válido');
            return;
        }
        
        if (email.length > 100) {
            mostrarErro('email', 'Email deve ter no máximo 100 caracteres');
            return;
        }
        
        limparErro('email');
    }
    
    /**
     * Validar senha em tempo real
     */
    function validarSenhaTempoReal() {
        const senhaInput = document.getElementById('senha');
        const senha = senhaInput?.value;
        
        if (!senha) {
            limparErro('senha');
            return;
        }
        
        if (senha.length < 6) {
            mostrarErro('senha', 'Senha deve ter pelo menos 6 caracteres');
            return;
        }
        
        if (senha.length > 50) {
            mostrarErro('senha', 'Senha deve ter no máximo 50 caracteres');
            return;
        }
        
        limparErro('senha');
    }
    
    /**
     * Validar telefone em tempo real
     */
    function validarTelefoneTempoReal() {
        const telefoneInput = document.getElementById('telefone');
        const telefone = telefoneInput?.value.replace(/\D/g, '');
        
        if (!telefone) {
            limparErro('telefone');
            return;
        }
        
        if (telefone.length < 10) {
            mostrarErro('telefone', 'Telefone deve ter pelo menos 10 dígitos');
            return;
        }
        
        if (telefone.length > 11) {
            mostrarErro('telefone', 'Telefone deve ter no máximo 11 dígitos');
            return;
        }
        
        limparErro('telefone');
    }
    
    /**
     * Validar data de nascimento em tempo real
     */
    function validarDataNascimentoTempoReal() {
        const dataInput = document.getElementById('dt_nascimento');
        const data = dataInput?.value;
        
        if (!data) {
            limparErro('dt_nascimento');
            return;
        }
        
        const dataNascimento = new Date(data);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNascimento.getFullYear();
        
        if (idade < 18) {
            mostrarErro('dt_nascimento', 'Professor deve ter pelo menos 18 anos');
            return;
        }
        
        if (idade > 80) {
            mostrarErro('dt_nascimento', 'Data de nascimento inválida');
            return;
        }
        
        limparErro('dt_nascimento');
    }
    
    /**
     * Validar data de admissão em tempo real
     */
    function validarDataAdmissaoTempoReal() {
        const dataInput = document.getElementById('dt_admissao');
        const data = dataInput?.value;
        
        if (!data) {
            limparErro('dt_admissao');
            return;
        }
        
        const dataAdmissao = new Date(data);
        const hoje = new Date();
        
        if (dataAdmissao > hoje) {
            mostrarErro('dt_admissao', 'Data de admissão não pode ser futura');
            return;
        }
        
        // Verificar se data não é muito antiga (mais de 50 anos)
        const anoMinimo = hoje.getFullYear() - 50;
        if (dataAdmissao.getFullYear() < anoMinimo) {
            mostrarErro('dt_admissao', 'Data de admissão muito antiga');
            return;
        }
        
        limparErro('dt_admissao');
    }
    
    /**
     * Validar titulação em tempo real
     */
    function validarTitulacaoTempoReal() {
        const titulacaoInput = document.getElementById('titulacao');
        const titulacao = titulacaoInput?.value;
        
        if (!titulacao) {
            mostrarErro('titulacao', 'Selecione uma titulação');
            return;
        }
        
        const titulacoesValidas = ['graduado', 'especialista', 'mestre', 'doutor'];
        if (!titulacoesValidas.includes(titulacao)) {
            mostrarErro('titulacao', 'Titulação inválida');
            return;
        }
        
        limparErro('titulacao');
    }
    
    /**
     * Validar rua em tempo real
     */
    function validarRuaTempoReal() {
        const ruaInput = document.getElementById('rua');
        const rua = ruaInput?.value.trim();
        
        if (!rua) {
            limparErro('rua');
            return;
        }
        
        if (rua.length < 3) {
            mostrarErro('rua', 'Rua deve ter pelo menos 3 caracteres');
            return;
        }
        
        if (rua.length > 100) {
            mostrarErro('rua', 'Rua deve ter no máximo 100 caracteres');
            return;
        }
        
        limparErro('rua');
    }
    
    /**
     * Validar bairro em tempo real
     */
    function validarBairroTempoReal() {
        const bairroInput = document.getElementById('bairro');
        const bairro = bairroInput?.value.trim();
        
        if (!bairro) {
            limparErro('bairro');
            return;
        }
        
        if (bairro.length < 3) {
            mostrarErro('bairro', 'Bairro deve ter pelo menos 3 caracteres');
            return;
        }
        
        if (bairro.length > 50) {
            mostrarErro('bairro', 'Bairro deve ter no máximo 50 caracteres');
            return;
        }
        
        limparErro('bairro');
    }
    
    /**
     * Mostrar mensagem de erro em campo específico
     */
    function mostrarErro(campo, mensagem) {
        const erroElement = document.getElementById(`erro-${campo}`);
        const inputElement = document.getElementById(campo);
        
        if (erroElement) {
            erroElement.textContent = mensagem;
        }
        
        if (inputElement) {
            inputElement.classList.add('is-invalid');
        }
    }
    
    /**
     * Limpar mensagem de erro de campo específico
     */
    function limparErro(campo) {
        const erroElement = document.getElementById(`erro-${campo}`);
        const inputElement = document.getElementById(campo);
        
        if (erroElement) {
            erroElement.textContent = '';
        }
        
        if (inputElement) {
            inputElement.classList.remove('is-invalid');
        }
    }
    
    // ========== FORMATADORES (MANTIDOS NO FRONTEND PARA UX) ==========
    
    // Formatadores (mantidos no frontend para UX)
    function formatarCPF(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,3})$/, "$1.$2.$3");
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{0,3})$/, "$1.$2");
        }
        
        e.target.value = value;
    }

    function formatarTelefone(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
        }
        
        e.target.value = value;
    }

    function validarNomeInput(e) {
        let value = e.target.value;
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) {
            e.target.value = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
        }
    }
});
