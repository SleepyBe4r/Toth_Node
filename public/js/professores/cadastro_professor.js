/**
 * Arquivo responsável pelo cadastro de professores na área do professor
 * Validações, formatações e envio via fetch
 */

document.addEventListener("DOMContentLoaded", () => {
    const formProfessor = document.getElementById("professorForm");
    const inputCPF = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");
    const inputNome = document.getElementById("nome");
    const inputDataNascimento = document.getElementById("dt_nascimento");
    
    // Configurar formatações
    if (inputCPF) {
        inputCPF.addEventListener('input', formatarCPF);
    }
    
    if (inputTelefone) {
        inputTelefone.addEventListener('input', formatarTelefone);
    }
    
    if (inputNome) {
        inputNome.addEventListener('input', validarNome);
    }
    
    // Configurar data máxima para nascimento (18 anos atrás)
    configurarDataMaxima();
    
    // Configurar envio do formulário
    if (formProfessor) {
        formProfessor.addEventListener("submit", submitForm);
    }
    
    /**
     * Formatação de CPF
     */
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
    
    /**
     * Formatação de telefone
     */
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
    
    /**
     * Validação de nome (apenas letras e espaços)
     */
    function validarNome(e) {
        let value = e.target.value;
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) {
            e.target.value = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
            document.getElementById('erro-nome').textContent = "Nome deve conter apenas letras e espaços";
        } else {
            document.getElementById('erro-nome').textContent = "";
        }
    }
    
    /**
     * Configurar data máxima para nascimento (18 anos atrás)
     */
    function configurarDataMaxima() {
        if (inputDataNascimento) {
            const hoje = new Date();
            const dataMinima = new Date();
            dataMinima.setFullYear(hoje.getFullYear() - 18);
            inputDataNascimento.max = dataMinima.toISOString().split('T')[0];
        }
    }
    
    /**
     * Exibir mensagem de erro
     */
    function showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    /**
     * Envio do formulário via fetch
     */
    async function submitForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/professor/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.ok) {
                alert(result.msg);
                window.location.href = '/professor';
            } else {
                showError(result.msg);
            }
        } catch (error) {
            showError('Erro ao cadastrar professor: ' + error.message);
        }
    }
});
