
document.addEventListener("DOMContentLoaded", ()=>{

    let lista_atividade = [];
    let ultimo_id = 0;
    const atividades = document.querySelector(`#slctAtividade_hidden`).options;

    function cadastrar() {
        let input_ano_letivo = document.querySelector("#slctAno");
        let input_serie = document.querySelector("#slctSerie");
        let input_turma = document.querySelector("#slctTurma");
        let input_bimestre = document.querySelector("#slctBimestre");
        let input_disciplina = document.querySelector("#slctDisciplina");
        let lista_validacao = [];

        let lista_input_atividade = [];
        for (let i = 0; i < lista_atividade.length; i++) {
            let input_atividade = document.querySelector(`#slctAtividade_${lista_atividade[i]}`);
            let input_peso = document.querySelector(`#txtPesoAtividade_${lista_atividade[i]}`);            
            if (
                input_atividade && input_peso &&
                input_atividade.value !== "" && input_peso.value !== ""
            ) {
                lista_input_atividade.push({
                    atividade: input_atividade,
                    peso: input_peso
                });
            } else {
                input_peso.value = "";
                input_atividade.value = "";
                input_atividade.selectedIndex = 0;
            }
        }

        
        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if (input_bimestre.value === "") lista_validacao.push(input_bimestre.id);
        if (input_disciplina.value === "") lista_validacao.push(input_disciplina.id);
        for (let i = 0; i < lista_input_atividade.length; i++) {
            for (let j = 0; j < lista_input_atividade.length; j++) {   
                if (i != j) {
                    if(lista_input_atividade[i].atividade.value == lista_input_atividade[j].atividade.value){
                        lista_validacao.push(lista_input_atividade[i].atividade.id);
                        lista_validacao.push(lista_input_atividade[j].atividade.id);
                    }
                }     
            }
        }
        let porcentagem_peso = 0;
        for (let i = 0; i < lista_input_atividade.length; i++) {
            porcentagem_peso += parseInt(lista_input_atividade[i].peso.value.replace('%', ''));
            if(lista_input_atividade[i].peso.value === "") lista_validacao.push(lista_input_atividade[i].peso.id);
        }

        if (porcentagem_peso > 100) {
            alert("A soma dos pesos das atividades não pode ultrapassar 100%!");
            for (let i = 0; i < lista_input_atividade.length; i++) {
                lista_validacao.push(lista_input_atividade[i].peso.id);
            }
        }

        if(lista_validacao.length == 0){
            let atividades = [];
            for (let i = 0; i < lista_input_atividade.length; i++) {
                atividades.push({                                        
                    id_atividade: parseInt(lista_input_atividade[i].atividade.value),
                    peso: parseInt(lista_input_atividade[i].peso.value.replace('%', ''))
                });
            }

            let obj = {
                id_ano_letivo: parseInt(input_ano_letivo.value),
                id_serie: parseInt(input_serie.value),
                id_turma: parseInt(input_turma.value),
                bimestre: parseInt(input_bimestre.value),
                id_disciplina: parseInt(input_disciplina.value),
                atividades: atividades
            }

            fetch("/quadro_notas/cadastrar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/quadro_notas';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        
        let input_id = document.querySelector("#hidden_id");
        let input_serie = document.querySelector("#txtSerie");
        let lista_validacao = [];

        let input_disciplina = [];
        for (let i = 0; i < lista_atividade.length; i++) {
            input_disciplina.push({
                disciplina: document.querySelector(`#slctDisciplina_${lista_atividade[i]}`)
            });
        }

        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        for (let i = 0; i < input_disciplina.length; i++) {
            for (let j = 0; j < input_disciplina.length; j++) {   
                if (i != j) {
                    if(input_disciplina[i].disciplina.value == input_disciplina[j].disciplina.value){
                        lista_validacao.push(input_disciplina[i].disciplina.id)
                    }
                }     
            }
        }

        if(lista_validacao.length == 0){
            let atividades = [];
            for (let i = 0; i < input_disciplina.length; i++) {
                atividades.push({
                    disciplina: parseInt(input_disciplina[i].disciplina.value)
                });
            }

            let obj = {
                id_serie: input_id.value,
                serie : input_serie.value,
                atividades: atividades
            }

            fetch("/serie/editar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                if(dados.ok) alert(dados.msg);
                window.location.href = '/serie';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function add_atividade() {
        let div_atividade = document.querySelector('.form-group.atividade');
        let atividadeItem = document.createElement('div');
        atividadeItem.classList.add('row');
        atividadeItem.classList.add('item_atividade');
        atividadeItem.classList.add('justify-content-between');

        if (lista_atividade.length > 0) {
            ultimo_id++;    
        }
        lista_atividade.push(ultimo_id);

        atividadeItem.id = `item_atividade_${ultimo_id}`;
        atividadeItem.innerHTML = `
        <div class="col-md-8">
            <select class="form-control" id="slctAtividade_${ultimo_id}">
                
            </select>
            <label for="slctAtividade_${ultimo_id}">Atividade *</label>
        </div>
        <div class="col-md-3">
            <input type="text" class="form-control" id="txtPesoAtividade_${ultimo_id}" placeholder="Peso da Atividade" required>
            <label for="txtPesoAtividade_${ultimo_id}">Peso da Atividade *</label>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-danger" data-id="${ultimo_id}" id="btn_excluir_${ultimo_id}">
                <i class="fas fa-minus"></i>
            </button>
        </div>
        `;
        
        div_atividade.appendChild(atividadeItem);
        inserir_atividade(ultimo_id);
        document.querySelector(`#btn_excluir_${ultimo_id}`).addEventListener("click", remover_atividade);
    }

    function inserir_atividade(id){
        let slct_Atividade = document.querySelector(`#slctAtividade_${id}`);
        for (let i = 0; i < atividades.length; i++) {
            const atividade = atividades[i];
            let option = document.createElement('option');
            if (i == 0) option.selected = true;
            option.disabled = atividade.disabled;
            option.value = atividade.value;
            option.textContent = atividade.text;
            slct_Atividade.appendChild(option);   
        }
    }

    function remover_atividade() {
        if(lista_atividade.length > 1){
            let id = this.dataset.id;
            let linha = document.querySelector(`#item_atividade_${id}`);
            let lista = [];
            for (let i = 0; i < lista_atividade.length; i++) {        
                if(lista_atividade[i] != id) lista.push(lista_atividade[i]);
            }
            lista_atividade = lista;
            linha.style.transition = '.5s';
            linha.style.opacity = '0';
            setTimeout(()=> linha.remove(), 500);
        } else{
            alert("É necessário ter pelo menos duas atividades para remover!");
        }
    }

    function aplicarMascaraPercentual(input) {
        input.addEventListener('input', function () {
            // Remove tudo que não for número
            let valor = this.value.replace(/\D/g, '');

            // Limita entre 1 e 100
            let numero = parseInt(valor, 10);
            if (isNaN(numero)) {
                numero = '';
            } else if (numero < 1) {
                numero = 1;
            } else if (numero > 100) {
                numero = 100;
            }

            this.value = numero !== '' ? numero + '%' : '';
        });

        // Remove o % ao focar para facilitar edição
        input.addEventListener('focus', function () {
            this.value = this.value.replace('%', '');
        });

        // Reaplica o % ao sair do campo
        input.addEventListener('blur', function () {
            let valor = this.value.replace(/\D/g, '');
            if (valor) {
                let numero = parseInt(valor, 10);
                if (numero < 1) numero = 1;
                if (numero > 100) numero = 100;
                this.value = numero + '%';
            } else {
                this.value = '';
            }
        });
    }

    // Aplica a máscara para todos os campos de peso de atividade já existentes
    document.querySelectorAll('[id^="txtPesoAtividade_"]').forEach(aplicarMascaraPercentual);

    // Aplica a máscara para novos campos criados dinamicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    const input = node.querySelector('input[id^="txtPesoAtividade_"]');
                    if (input) aplicarMascaraPercentual(input);
                }
            });
        });
    });
    observer.observe(document.querySelector('.form-group.atividade'), { childList: true });
    
    document.querySelector("#btn_add_atividade").addEventListener("click", add_atividade);

    let input_quadro = document.querySelector("#hidden_quadro_notas").value;
    if (input_quadro == "") {         
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
        lista_atividade.push(0);
        document.querySelector("#btn_excluir_0").addEventListener("click", remover_atividade);
    } else {
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
        let div_atividade = document.querySelector(".form-group.disciplina");
        for (let i = 0; i < div_atividade.children.length; i++) {
            lista_atividade.push(div_atividade.children[i].id.split("item_atividade_").pop());
            ultimo_id = parseInt(lista_atividade[i]);
            document.querySelector("#btn_excluir_"+ultimo_id).addEventListener("click", remover_atividade);
        }
    }
});