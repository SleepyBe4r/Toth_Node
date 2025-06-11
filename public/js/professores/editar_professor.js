/**
 * Arquivo responsável pela edição de professores na área do professor
 * Validações, formatações e envio via fetch
 */

document.addEventListener("DOMContentLoaded", () => {
    const formEditarProfessor = document.getElementById("formEditarProfessor");
    const inputTelefone = document.getElementById("telefone");
    const inputNome = document.getElementById("nome");
    
    // Configurar formatações
    if (inputTelefone) {
        inputTelefone.addEventListener('input', formatarTelefone);
    }
    
    if (inputNome) {
        inputNome.addEventListener('input', validarNome);
    }
    
    // Configurar envio do formulário
    if (formEditarProfessor) {
        formEditarProfessor.addEventListener("submit", submitForm);
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
            const response = await fetch('/professor/editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.ok) {
                // Exibir modal com mensagem de sucesso
                const modalLabel = document.getElementById('feedbackModalLabel');
                const modalBody = document.getElementById('feedbackModalBody');
                const modal = document.getElementById('feedbackModal');
                
                if (modalLabel && modalBody && modal) {
                    modalLabel.textContent = "Sucesso";
                    modalBody.textContent = result.msg;
                    
                    // Verificar se Bootstrap está disponível
                    if (typeof $ !== 'undefined' && $.fn.modal) {
                        $('#feedbackModal').modal('show');
                        
                        // Redirecionar após fechar o modal
                        $('#feedbackModal').on('hidden.bs.modal', function () {
                            window.location.href = '/professor';
                        });
                    } else {
                        // Fallback sem Bootstrap
                        alert(result.msg);
                        window.location.href = '/professor';
                    }
                } else {
                    alert(result.msg);
                    window.location.href = '/professor';
                }
            } else {
                showError(result.msg);
            }
        } catch (error) {
            showError('Erro ao editar professor: ' + error.message);
        }
    }
});
