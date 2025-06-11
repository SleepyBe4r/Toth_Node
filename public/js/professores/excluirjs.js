/**
 * Arquivo responsável pela listagem de professores (localStorage)
 * Exclusão e gerenciamento de professores via localStorage
 */

document.addEventListener("DOMContentLoaded", () => {
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
                        <button class="btn btn-danger btn-sm" onclick="excluirProfessor('${professor.id}')">Excluir</button>
                    </td>
                </tr>
            `;
        });

        tabela.innerHTML = html;
    }
    
    /**
     * Excluir professor por ID
     */
    window.excluirProfessor = function(id) {
        localStorage.removeItem("professores");
        let lista_aux = [];

        professores.forEach(e => {
            if (id != e.id) {
                lista_aux.push(e);
            }
        });

        localStorage.setItem('professores', JSON.stringify(lista_aux));
        professores = JSON.parse(localStorage.getItem('professores')) || [];
        carregarProfessores();
    }
    
    /**
     * Excluir professores selecionados
     */
    function excluirSelecionados() {
        const checkboxes = document.querySelectorAll("input[name='check_del']:checked");
        checkboxes.forEach(checkbox => excluirProfessor(checkbox.dataset.id));
        if (checkTodos) {
            checkTodos.checked = false;
        }
    }
    
    /**
     * Selecionar/deselecionar todos os checkboxes
     */
    function selecionarTodos() {
        const checkboxes = document.querySelectorAll("input[name='check_del']");
        const selecionarTodos = checkTodos ? checkTodos.checked : false;
        checkboxes.forEach(checkbox => (checkbox.checked = selecionarTodos));
    }
    
    /**
     * Função de logout
     */
    window.sair = function() {
        localStorage.removeItem("usuarioAtual");
        window.location = "/login";
    }
});
