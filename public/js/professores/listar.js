/**
 * Arquivo responsável pelo gerenciamento da listagem de professores
 * Exclusão de professores via fetch
 */

document.addEventListener("DOMContentLoaded", () => {
    // Configurar todos os botões de exclusão
    const botoesExcluir = document.querySelectorAll(".btn-excluir");
    
    botoesExcluir.forEach(botao => {
        botao.addEventListener("click", function() {
            const cpf = this.dataset.cpf;
            const nome = this.dataset.nome;
            
            if (confirm(`Tem certeza que deseja excluir o professor ${nome} (CPF: ${cpf})?`)) {
                excluirProfessor(cpf, this);
            }
        });
    });
    
    /**
     * Função para excluir professor via fetch
     * @param {string} cpf - CPF do professor a ser excluído
     * @param {HTMLElement} botaoElement - Elemento do botão clicado
     */
    function excluirProfessor(cpf, botaoElement) {
        const dados = {
            cpf: cpf
        };
        
        fetch("/admin/professores/excluir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(resultado => {
            alert(resultado.msg);
            
            if (resultado.ok) {
                // Remover a linha da tabela
                const linha = botaoElement.closest('tr');
                if (linha) {
                    linha.remove();
                }
            }
        })
        .catch(erro => {
            console.error("Erro:", erro);
            alert("Erro ao excluir professor. Tente novamente.");
        });
    }
});
