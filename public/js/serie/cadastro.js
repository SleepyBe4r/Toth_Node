
document.addEventListener("DOMContentLoaded", ()=>{

    let lista_serie = [];
    let ultimo_id = 0;
    const disciplinas = document.querySelector(`#slctDisciplina_hidden`).options;

    function cadastrar() {
        let input_serie = document.querySelector("#txtSerie");
        let lista_validacao = [];

        let lista_input_disciplina = [];
        for (let i = 0; i < lista_serie.length; i++) {
            let input_disciplina = document.querySelector(`#slctDisciplina_${lista_serie[i]}`);
            if (input_disciplina && input_disciplina.value !== "") {
                lista_input_disciplina.push({
                    disciplina: input_disciplina
                });
            }
        }

        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        for (let i = 0; i < lista_input_disciplina.length; i++) {
            for (let j = 0; j < lista_input_disciplina.length; j++) {   
                if (i != j) {
                    if(lista_input_disciplina[i].disciplina.value == lista_input_disciplina[j].disciplina.value){
                        lista_validacao.push(lista_input_disciplina[i].disciplina.id);
                        lista_validacao.push(lista_input_disciplina[j].disciplina.id);
                    }
                }     
            }
        }

        if(lista_validacao.length == 0){
            let disciplinas = [];
            for (let i = 0; i < lista_input_disciplina.length; i++) {                
                disciplinas.push({
                    disciplina: parseInt(lista_input_disciplina[i].disciplina.value)
                });
            }

            let obj = {
                serie : input_serie.value,
                disciplinas: disciplinas
            }

            fetch("/serie/cadastrar", {
                method :"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados) => {
                alert(dados.msg)
                if(dados.ok);
                window.location.href = '/serie';
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

        let lista_input_disciplina = [];
        for (let i = 0; i < lista_serie.length; i++) {
            let input_disciplina = document.querySelector(`#slctDisciplina_${lista_serie[i]}`);
            if (input_disciplina && input_disciplina.value !== "") {
                lista_input_disciplina.push({
                    disciplina: input_disciplina
                });
            }
        }

        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        for (let i = 0; i < lista_input_disciplina.length; i++) {
            for (let j = 0; j < lista_input_disciplina.length; j++) {   
                if (i != j) {
                    if(lista_input_disciplina[i].disciplina.value == lista_input_disciplina[j].disciplina.value){
                        lista_validacao.push(lista_input_disciplina[i].disciplina.id);
                        lista_validacao.push(lista_input_disciplina[j].disciplina.id);
                    }
                }     
            }
        }

        if(lista_validacao.length == 0){
            let disciplinas = [];
            for (let i = 0; i < lista_input_disciplina.length; i++) {
                disciplinas.push({
                    disciplina: parseInt(lista_input_disciplina[i].disciplina.value)
                });
            }

            let obj = {
                id_serie: input_id.value,
                serie : input_serie.value,
                disciplinas: disciplinas
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
                alert(dados.msg);
                if(dados.ok) 
                window.location.href = '/serie';
            })
            .catch((erro) => console.error("erro:", erro));

        }else {
            validar_campos(lista_validacao);
        }
    }

    function add_disciplina() {
        let div_disciplina = document.querySelector('.form-group.disciplina');
        let disciplinaItem = document.createElement('div');
        disciplinaItem.classList.add('row');
        disciplinaItem.classList.add('item_disciplina');
        disciplinaItem.classList.add('justify-content-between');

        if (lista_serie.length > 0) {
            ultimo_id++;    
        }
        lista_serie.push(ultimo_id);

        disciplinaItem.id = `item_disciplina_${ultimo_id}`;
        disciplinaItem.innerHTML = `
        <div class="col-md-5">
            <select class="form-control" id="slctDisciplina_${ultimo_id}">
                
            </select>
            <label for="slctDisciplina_${ultimo_id}"><strong>Disciplina: *</strong> </label>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-danger" data-id="${ultimo_id}" id="btn_excluir_${ultimo_id}">            
                <i class="fas fa-minus"></i>
            </button>
        </div>
        `;
        
        div_disciplina.appendChild(disciplinaItem);
        inserir_Disciplina(ultimo_id);
        document.querySelector(`#btn_excluir_${ultimo_id}`).addEventListener("click", remover_disciplina);
    }

    function inserir_Disciplina(id){
        let slct_Disc = document.querySelector(`#slctDisciplina_${id}`);
        for (let i = 0; i < disciplinas.length; i++) {
            const disciplina = disciplinas[i];
            let option = document.createElement('option');
            if (i == 0) option.selected = true;
            option.disabled = disciplina.disabled;
            option.value = disciplina.value;
            option.textContent = disciplina.text;
            slct_Disc.appendChild(option);   
        }
    }

    function remover_disciplina() {
        if(lista_serie.length > 1){
            let id = this.dataset.id;
            let linha = document.querySelector(`#item_disciplina_${id}`);
            let lista = [];
            for (let i = 0; i < lista_serie.length; i++) {        
                if(lista_serie[i] != id) lista.push(lista_serie[i]);
            }
            lista_serie = lista;
            linha.style.transition = '.5s';
            linha.style.opacity = '0';
            setTimeout(()=> linha.remove(), 500);
        } else{
            alert("É necessário ter pelo menos duas disciplinas para remover!");
        }
    }
    
    document.querySelector("#btn_add_disc").addEventListener("click", add_disciplina);

    let input_serie = document.querySelector("#hidden_serie").value;
    if (input_serie == "") {         
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
        lista_serie.push(0);
        document.querySelector("#btn_excluir_0").addEventListener("click", remover_disciplina);
    } else {
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
        let div_disciplina = document.querySelector(".form-group.disciplina");
        for (let i = 0; i < div_disciplina.children.length; i++) {
            lista_serie.push(div_disciplina.children[i].id.split("item_disciplina_").pop());
            ultimo_id = parseInt(lista_serie[i]);
            document.querySelector("#btn_excluir_"+ultimo_id).addEventListener("click", remover_disciplina);
        }
    }
});