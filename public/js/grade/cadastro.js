
document.addEventListener("DOMContentLoaded", () => {
    const manha = [
        { periodo: 1, horario: "07:10/08:00"},
        { periodo: 2, horario: "08:00/08:50"},
        { periodo: 3, horario: "08:50/09:40"},
        { periodo: 4, horario: "09:40/10:00"},
        { periodo: 5, horario: "10:00/10:50"},
        { periodo: 6, horario: "10:50/11:40"},
        { periodo: 7, horario: "11:40/12:30"}
    ];

    const tarde = [
        { periodo: 1, horario: "13:00/13:50"},
        { periodo: 2, horario: "13:50/14:40"},
        { periodo: 3, horario: "14:40/15:30"},
        { periodo: 4, horario: "15:30/15:50"},
        { periodo: 5, horario: "15:50/16:40"},
        { periodo: 6, horario: "16:40/17:30"},
        { periodo: 7, horario: "17:30/18:20"}
    ];

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
                grade: grade
            }

            fetch("/grade/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then((resposta) => resposta.json())
                .then((dados) => {
                    if (dados.ok) alert(dados.msg);
                    window.location.href = '/grade';
                })
                .catch((erro) => console.error("erro:", erro));

        } else {
            validar_campos(lista_validacao);
        }
    }

    function atualizar() {
        let input_id = document.querySelector("#hidden_id");
        let input_turma = document.querySelector("#slctTurma");
        let input_grade = [];
        for (let i = 0; i < lista_Grade.length; i++) {
            input_grade.push({
                id_item: lista_Grade[i],
                disciplina: document.querySelector(`#slctDisciplina_${lista_Grade[i]}`),
                professor: document.querySelector(`#slctProfessor_${lista_Grade[i]}`)
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
                    id_item: input_grade[i].id_item,
                    disciplina: input_grade[i].disciplina.value,
                    professor: input_grade[i].professor.value
                });
            }

            let obj = {
                id_grade: input_id.value,
                turma: input_turma.value,
                grade: grade
            }

            fetch("/grade/editar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then((resposta) => resposta.json())
                .then((dados) => {
                    if (dados.ok) alert(dados.msg);
                    window.location.href = '/grade';
                })
                .catch((erro) => console.error("erro:", erro));

        } else {
            validar_campos(lista_validacao);
        }
    }    

    function add_horario() {
        let input_horario = document.querySelector('#slctHorario');
        let input_disciplina = document.querySelector('#slctDisciplina');
        let input_professor = document.querySelector('#slctProfessor');

        let diasSelecionados = [];
        
        document.querySelectorAll('.form-check-input.dia_semana:checked').forEach(checkbox => {
            diasSelecionados.push(checkbox.value);
        });

        let lista_validacao = [];

        if( (input_disciplina.value == "" && input_professor.value !== '') || (input_disciplina.value != "" && input_professor.value === '')){
            lista_validacao.push(input_disciplina.id);
            lista_validacao.push(input_professor.id);
        }

        if(lista_validacao.length == 0){
            for (let i = 0; i < diasSelecionados.length; i++) {
                let item_horario = document.querySelector(`#${diasSelecionados[i]}_${input_horario.value}`);            
                if (item_horario) {
                    
                    if(item_horario.children[0].dataset.id_disc){                        
                        if (confirm(`Certeza que deseja substituir o horario ${input_horario.selectedOptions[0].text} - ${diasSelecionados[i]}?`)) {
                            if(input_disciplina.value == "" && input_professor.value == ''){
                                item_horario.innerHTML = `
                                    <label class="text-dark"><b>------</b></label> <br>
                                    <span><small>Professor: <br> ------</small></span>     
                                `;
                            } else{
                                item_horario.innerHTML = `
                                    <label class="text-dark" data-id_disc="${input_disciplina.value}"><b>${input_disciplina.selectedOptions[0].text}</b></label> <br>
                                    <span data-id_prof="${input_professor.value}"><small>Professor: <br> ${input_professor.selectedOptions[0].text}</small></span>  
                                `;
                            }
                        }                
                    } else{
                        if(input_disciplina.value == "" && input_professor.value == ''){
                            item_horario.innerHTML = `
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>     
                            `;
                        } else{
                            item_horario.innerHTML = `
                                <label class="text-dark" data-id_disc="${input_disciplina.value}"><b>${input_disciplina.selectedOptions[0].text}</b></label> <br>
                                <span data-id_prof="${input_professor.value}"><small>Professor: <br> ${input_professor.selectedOptions[0].text}</small></span>  
                            `;
                        }
                    }
                
                }         
            }
            $('#modalHorario').modal('hide');
        }else {
            validar_campos(lista_validacao);
        }
       
    }
    
    function iniciar_tabela() {
        let input_periodo = this;
        let input_horario = document.querySelector("#slctHorario");
        let btn_horario = document.querySelector("#btn_modal_horario");

        btn_horario.disabled = false;

        input_horario.innerHTML = `
            <option value="" selected disabled>Selecione um Horario</option>
        `;
        switch (parseInt(input_periodo.value)) {
            case 1:
                for (let i = 0; i < manha.length; i++) {
                    let linha = document.querySelector("#horario_" + (i+1));
                    
                    if(i == 3){
                        linha.innerHTML = `
                            <td class="p-2 align-middle" id="hora_${i + 1}" >${manha[i].horario}</td>
                            <td class="p-2" colspan="7" >
                                <label class="text-dark text-center d-flex justify-content-center"><b>Intervalo</b></label>                     
                            </td>                            
                        `;
                    } else{
                        linha.innerHTML = `
                            <td class="p-2 align-middle" id="hora_${i + 1}" >${manha[i].horario}</td>
                            <td class="p-2" id="dom_${i + 1}" >
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>                                
                            </td>
                            <td class="p-2" id="seg_${i + 1}" >
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="ter_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="qua_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="qui_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="sex_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="sab_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                        `;

                        input_horario.innerHTML += `
                            <option value="${i + 1}">${manha[i].horario}</option>
                        `;
                    }

                    
                }
                break;
            case 2:
                for (let i = 0; i < tarde.length; i++) {
                    let linha = document.querySelector("#horario_" + (i+1));
                    
                    if(i == 3){
                        linha.innerHTML = `
                            <td class="p-2 align-middle" id="hora_${i + 1}" >${tarde[i].horario}</td>
                            <td class="p-2" colspan="7" >
                                <label class="text-dark text-center d-flex justify-content-center"><b>Intervalo</b></label>                                                               
                            </td>                            
                        `;
                    } else{
                        linha.innerHTML = `
                            <td class="p-2 align-middle" id="hora_${i + 1}" >${tarde[i].horario}</td>
                            <td class="p-2" id="dom_${i + 1}" >
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>                                
                            </td>
                            <td class="p-2" id="seg_${i + 1}" >
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="ter_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="qua_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="qui_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="sex_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                            <td class="p-2" id="sab_${i + 1}" >                                
                                <label class="text-dark"><b>------</b></label> <br>
                                <span><small>Professor: <br> ------</small></span>
                            </td>
                        `;
                        input_horario.innerHTML += `
                          <option value="${i + 1}">${tarde[i].horario}</option>
                        `;
                    }

                }
                break;

        
            default:
                break;
        }
    }    
    
    document.querySelector("#btn_add_horario").addEventListener("click", add_horario);
    document.querySelector("#slctPeriodo").addEventListener("change", iniciar_tabela);
    
    let input_usuario = document.querySelector("#hidden_grade").value;
    if (input_usuario == ""){
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    } else{
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
        let div_horario = document.querySelector(".form-group.horario");
        for (let i = 0; i < div_horario.children.length; i++) {
            lista_Grade.push(div_horario.children[i].id.split("item_disciplina_").pop());
            ultimo_id = parseInt(lista_Grade[i]);
        }
    }
});