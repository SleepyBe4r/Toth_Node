/**
 * Arquivo consolidado responsável pela edição de professores
 * Funciona tanto para área administrativa quanto área do professor
 * Validações movidas para o backend
 */

document.addEventListener("DOMContentLoaded", () => {
    // Detectar contexto baseado na URL ou elementos específicos
    const isAdminArea = window.location.pathname.includes('/admin/');
    const formEditar = document.getElementById('formEditarProfessor');
    
    if (formEditar) {
        inicializarEdicao();
    }
    
    /**
     * Inicializar funcionalidades de edição
     */
    function inicializarEdicao() {
        configurarEventos();
        configurarFormatacao();
    }
    
    /**
     * Configura os eventos do formulário
     */
    function configurarEventos() {
        const formulario = document.getElementById('formEditarProfessor');
        if (formulario) {
            formulario.addEventListener('submit', processarEdicao);
        }
    }
    
    /**
     * Configura formatação automática dos campos
     */
    function configurarFormatacao() {
        // Formatação de telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', formatarTelefone);
        }
        
        // Validação de nome em tempo real
        const nomeInput = document.getElementById('nome');
        if (nomeInput) {
            nomeInput.addEventListener('input', validarNomeInput);
        }
    }
    
    /**
     * Processar edição do professor
     */
    function processarEdicao(event) {
        event.preventDefault();
        
        // Coletar dados do formulário
        const dados = coletarDadosFormulario();
        
        // Validação simples no frontend (apenas campos vazios)
        const camposVazios = validarCamposObrigatorios(dados);
        
        if (camposVazios.length > 0) {
            destacarCamposVazios(camposVazios);
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        
        // Determinar endpoint baseado no contexto
        const isAdminArea = window.location.pathname.includes('/admin/');
        const endpoint = isAdminArea ? "/admin/professores/editar" : "/professor/editar";
        const redirectUrl = isAdminArea ? "/admin/professores" : "/professor/home";
        
        // Enviar para backend
        enviarDadosParaBackend(dados, endpoint, redirectUrl);
    }
    
    /**
     * Coleta todos os dados do formulário
     * @returns {Object} Objeto com todos os dados do formulário
     */
    function coletarDadosFormulario() {
        const formulario = document.getElementById('formEditarProfessor');
        const formData = new FormData(formulario);
        const dados = {};
        
        // Converter FormData para objeto JavaScript
        for (let [key, value] of formData.entries()) {
            dados[key] = value;
        }
        
        return dados;
    }
    
    /**
     * Validar campos obrigatórios
     */
    function validarCamposObrigatorios(dados) {
        const camposVazios = [];
        const camposObrigatorios = ['nome', 'email', 'telefone', 'titulacao'];
        
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
        document.querySelectorAll('small[id^="erro-"]').forEach(el => el.textContent = "");
        
        // Destacar campos vazios
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.classList.add('is-invalid');
            }
            
            const errorElement = document.getElementById(`erro-${campo}`);
            if (errorElement) {
                errorElement.textContent = `${campo.charAt(0).toUpperCase() + campo.slice(1)} é obrigatório`;
            }
        });
    }
    
    /**
     * Limpar todas as validações visuais do formulário
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
                // Se houver erros específicos do backend, exibir
                if (resultado.erros) {
                    exibirErrosBackend(resultado.erros);
                } else {
                    alert(resultado.msg);
                }
            }
        })
        .catch(erro => {
            console.error("Erro:", erro);
            alert("Erro ao conectar com o servidor");
        });
    }
    
    /**
     * Exibir erros específicos retornados pelo backend
     */
    function exibirErrosBackend(erros) {
        limparValidacoes();
        
        Object.keys(erros).forEach(campo => {
            const inputElement = document.getElementById(campo);
            const errorElement = document.getElementById(`erro-${campo}`);
            
            if (inputElement) {
                inputElement.classList.add('is-invalid');
            }
            
            if (errorElement) {
                errorElement.textContent = erros[campo];
            }
        });
        
        alert("Por favor, corrija os erros no formulário antes de continuar.");
    }
    
    // Formatadores (mantidos no frontend para UX)
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
            const errorElement = document.getElementById('erro-nome');
            if (errorElement) {
                errorElement.textContent = "Nome deve conter apenas letras e espaços";
            }
        } else {
            const errorElement = document.getElementById('erro-nome');
            if (errorElement) {
                errorElement.textContent = "";
            }
        }
    }
});
