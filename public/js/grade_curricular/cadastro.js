
document.addEventListener("DOMContentLoaded", () => {
    const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta"];
    const gradePorDia = {
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: []
    };
    let lista_Grade = [];
    lista_Grade.push(0);

    const disciplinas = document.querySelector(`#slctDisciplina_${lista_Grade[0]}`).options;
    const professores = document.querySelector(`#slctProfessor_${lista_Grade[0]}`).options;

    function cadastrar() {
        let input_turma = document.querySelector("#slctTurma");
        let input_grade = [];
        for (let i = 0; i < lista_Grade.length; i++) {
            input_grade.push({
                disciplina: document.querySelector(`#slctDisciplina_${lista_Grade[i]}`),
                professor: document.querySelector(`#slctProfessor_${lista_Grade[i]}`),
            });
        }
        let lista_validacao = [];

        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        for (let i = 0; i < input_grade.length; i++) {
            for (let j = 0; j < input_grade.length; j++) {   
                if (i != j) {
                    if(input_grade[i].disciplina.value == input_grade[j].disciplina.value){
                        lista_validacao.push(input_grade[i].disciplina.id);
                        lista_validacao.push(input_grade[j].disciplina.id);
                    }
                }     
            }
        }

        if (lista_validacao.length == 0) {

            let grade = [];
            for (let i = 0; i < input_grade.length; i++) {
                grade.push({
                    disciplina: input_grade[i].disciplina.value,
                    professor: input_grade[i].professor.value
                });
            }

            let obj = {
                turma: input_turma.value,
                grade_curricular: grade
            }

            fetch("/grade_curricular/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then((resposta) => resposta.json())
                .then((dados) => {
                    if (dados.ok) alert(dados.msg);
                    window.location.href = '/grade_curricular';
                })
                .catch((erro) => console.error("erro:", erro));

        } else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_ano_letivo = document.querySelector("#txtAno");
        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if (lista_validacao.length == 0) {
            let obj = {
                id: input_id.value,
                ano_letivo: input_ano_letivo.value,
            }

            fetch("/ano_letivo/editar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then((resposta) => resposta.json())
                .then((dados) => {
                    if (dados.ok) alert(dados.msg);
                    window.location.href = '/ano_letivo';
                })
                .catch((erro) => console.error("erro:", erro));

        } else {
            validar_campos(lista_validacao);
        }
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

    function inserir_Professor(id){
        let slct_Disc = document.querySelector(`#slctProfessor_${id}`);
        for (let i = 0; i < professores.length; i++) {
            const professor = professores[i];
            let option = document.createElement('option');
            if (i == 0) option.selected = true;
            option.disabled = professor.disabled;
            option.value = professor.value;
            option.textContent = professor.text;
            slct_Disc.appendChild(option);   
        }
    }

    function remover_disciplina() {
        if(lista_Grade.length > 1){
            let id = this.dataset.id;
            let linha = document.querySelector(`#item_disciplina_${id}`);
            let lista = [];
            for (let i = 0; i < lista_Grade.length; i++) {        
                if(lista_Grade[i] != id) lista.push(lista_Grade[i]);
            }
            lista_Grade = lista;
            linha.style.transition = '.5s';
            linha.style.opacity = '0';
            setTimeout(()=> linha.remove(), 500);
        } else{
            alert("É necessário ter pelo menos duas disciplinas para remover!");
        }
    }

    function add_disciplina() {
        let div_disciplina = document.querySelector('.form-group.disciplina');
        let disciplinaItem = document.createElement('div');
        disciplinaItem.classList.add('row');
        disciplinaItem.classList.add('item_disciplina');
        disciplinaItem.classList.add('justify-content-between');
        
        lista_Grade.push(lista_Grade[lista_Grade.length - 1] + 1);
        let ultimo_id = lista_Grade[lista_Grade.length - 1];

        disciplinaItem.id = `item_disciplina_${ultimo_id}`;
        disciplinaItem.innerHTML = `
        <div class="col-md-5">
            <select class="form-control" id="slctDisciplina_${ultimo_id}">
                
            </select>
            <label for="slctDisciplina_${ultimo_id}">Disciplina </label>
        </div>
        <div class="col-md-5">
            <select class="form-control" id="slctProfessor_${ultimo_id}">
                
            </select>
            <label for="slctProfessor_${ultimo_id}">Professor </label>
        </div>
        <div class="col-md-1">
            <button type="button" class="btn btn-danger" onclick="remover_disciplina()" data-id="${ultimo_id}" id="btn_excluir_${ultimo_id}">            
                <i class="fas fa-minus"></i>
            </button>
        </div>
        `;
        
        div_disciplina.appendChild(disciplinaItem);
        inserir_Disciplina(ultimo_id);
        inserir_Professor(ultimo_id);
        document.querySelector(`#btn_excluir_${ultimo_id}`).addEventListener("click", remover_disciplina);
    }

    

    document.querySelector("#btn_excluir_0").addEventListener("click", remover_disciplina);
    
    document.querySelector("#btn_add_disc").addEventListener("click", add_disciplina);

    let input_usuario = document.querySelector("#hidden_grade_curricular").value;
    if (input_usuario == "")
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});