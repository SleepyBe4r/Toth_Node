/**
 * Arquivo consolidado responsável pela listagem e exclusão de professores
 * Funciona tanto para área administrativa (banco de dados) quanto localStorage
 * Validações movidas para o backend
 */

document.addEventListener("DOMContentLoaded", () => {
    // Detectar contexto baseado na URL ou elementos específicos
    const isLocalStorage = window.location.pathname.includes('Professor_Index.html') || 
                          document.getElementById('lista_professores');
    const isAdminArea = window.location.pathname.includes('/admin/');
    
    if (isLocalStorage) {
        inicializarListagemLocalStorage();
    } else if (isAdminArea) {
        inicializarListagemAdmin();
    }
    
    /**
     * Inicializar listagem para localStorage (Professor_Index.html)
     */
    function inicializarListagemLocalStorage() {
        let professores = JSON.parse(localStorage.getItem('professores')) || [];
        const tabela = document.getElementById('lista_professores');
        const btnExcluirSelecionados = document.getElementById('btnExcluirSelecionados');
        const checkTodos = document.getElementById('ckTodos');
        
        // Configurar eventos
        if (btnExcluirSelecionados) {
            btnExcluirSelecionados.addEventListener('click', excluirSelecionados);
        }
        
        if (checkTodos) {
            checkTodos.addEventListener('change', selecionarTodos);
        }
        
        // Carregar professores ao inicializar
        carregarProfessores();
        
        /**
         * Carregar e exibir professores na tabela
         */
        function carregarProfessores() {
            if (!tabela) return;
            
            let html = '';
            professores.forEach(professor => {
                html += `
                    <tr>
                        <td><input type="checkbox" name="check_del" data-id="${professor.id}"></td>
                        <td>${professor.nome}</td>
                        <td>${professor.cpf}</td>
                        <td>${professor.telefone}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="excluirProfessorLocalStorage('${professor.id}')">Excluir</button>
                        </td>
                    </tr>
                `;
            });

            tabela.innerHTML = html;
        }
        
        /**
         * Excluir professor por ID no localStorage
         */
        window.excluirProfessorLocalStorage = function(id) {
            if (confirm('Tem certeza que deseja excluir este professor?')) {
                professores = professores.filter(prof => prof.id !== id);
                localStorage.setItem('professores', JSON.stringify(professores));
                carregarProfessores();
                alert('Professor excluído com sucesso!');
            }
        };
        
        /**
         * Excluir professores selecionados
         */
        function excluirSelecionados() {
            const checkboxes = document.querySelectorAll('input[name="check_del"]:checked');
            
            if (checkboxes.length === 0) {
                alert('Selecione pelo menos um professor para excluir.');
                return;
            }
            
            if (confirm(`Tem certeza que deseja excluir ${checkboxes.length} professor(es)?`)) {
                const idsParaExcluir = Array.from(checkboxes).map(cb => cb.dataset.id);
                professores = professores.filter(prof => !idsParaExcluir.includes(prof.id));
                localStorage.setItem('professores', JSON.stringify(professores));
                carregarProfessores();
                alert('Professores excluídos com sucesso!');
            }
        }
        
        /**
         * Selecionar/deselecionar todos os checkboxes
         */
        function selecionarTodos() {
            const checkboxes = document.querySelectorAll('input[name="check_del"]');
            const isChecked = checkTodos.checked;
            
            checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        }
    }
    
    /**
     * Inicializar listagem para área administrativa (banco de dados)
     */
    function inicializarListagemAdmin() {
        // Configurar todos os botões de exclusão
        const botoesExcluir = document.querySelectorAll(".btn-excluir");
        
        botoesExcluir.forEach(botao => {
            botao.addEventListener("click", function() {
                const cpf = this.dataset.cpf;
                const nome = this.dataset.nome;
                
                if (confirm(`Tem certeza que deseja excluir o professor ${nome} (CPF: ${cpf})?`)) {
                    excluirProfessorAdmin(cpf, this);
                }
            });
        });
        
        /**
         * Função para excluir professor via fetch (área administrativa)
         * @param {string} cpf - CPF do professor a ser excluído
         * @param {HTMLElement} botaoElement - Elemento do botão clicado
         */
        function excluirProfessorAdmin(cpf, botaoElement) {
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
                alert("Erro ao conectar com o servidor");
            });
        }
    }
});
