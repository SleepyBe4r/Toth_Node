
document.addEventListener("DOMContentLoaded", () => {
    const manha = [
        { periodo: 1, horario_inicio: "07:10", horario_fim: "08:00"},
        { periodo: 2, horario_inicio: "08:00", horario_fim: "08:50"},
        { periodo: 3, horario_inicio: "08:50", horario_fim: "09:40"},
        { periodo: 4, horario_inicio: "09:40", horario_fim: "10:00"},
        { periodo: 5, horario_inicio: "10:00", horario_fim: "10:50"},
        { periodo: 6, horario_inicio: "10:50", horario_fim: "11:40"},
        { periodo: 7, horario_inicio: "11:40", horario_fim: "12:30"}
    ];

    const tarde = [
        { periodo: 1, horario_inicio: "13:00", horario_fim: "13:50"},
        { periodo: 2, horario_inicio: "13:50", horario_fim: "14:40"},
        { periodo: 3, horario_inicio: "14:40", horario_fim: "15:30"},
        { periodo: 4, horario_inicio: "15:30", horario_fim: "15:50"},
        { periodo: 5, horario_inicio: "15:50", horario_fim: "16:40"},
        { periodo: 6, horario_inicio: "16:40", horario_fim: "17:30"},
        { periodo: 7, horario_inicio: "17:30", horario_fim: "18:20"}
    ];

    const dias_semana = [
        {id: 1, dia:"dom"}, 
        {id: 2, dia:"seg"}, 
        {id: 3, dia:"ter"}, 
        {id: 4, dia:"qua"}, 
        {id: 5, dia:"qui"}, 
        {id: 6, dia:"sex"}, 
        {id: 7, dia:"sab"}
    ];

    var tabela_iniciada = false;
    var serie_selecionada = false;

    function cadastrar() {
        let input_periodo = document.querySelector('#slctPeriodo');
        let input_ano_letivo = document.querySelector("#slctAno");
        let input_serie = document.querySelector("#slctSerie");
        let input_turma = document.querySelector("#slctTurma");
        let input_sala = document.querySelector("#slctSala");
        let input_grade = [];
        let possui_grade = false;

        if(parseInt(input_periodo.value) == 1){
            for (let i = 0; i < manha.length; i++) {
                for (let j = 0; j < dias_semana.length; j++) {
                    let item_horario = document.querySelector(`#${dias_semana[j].dia}_${manha[i].periodo}`); 
                    if (item_horario &&
                        item_horario.children.length >= 3 &&
                        item_horario.children[0].dataset.id_disc != "" &&
                        item_horario.children[2].dataset.id_prof != "") {
                            
                        input_grade.push({
                            horario_inicio: manha[i].horario_inicio,
                            horario_fim: manha[i].horario_fim,
                            dia: dias_semana[j].id,
                            disciplina: item_horario.children[0].dataset.id_disc,
                            professor: item_horario.children[2].dataset.id_prof,
                            periodo: parseInt(input_periodo.value)
                        });
                    }   
                }   
            }
        } else {
            for (let i = 0; i < tarde.length; i++) {
                for (let j = 0; j < dias_semana.length; j++) {
                    let item_horario = document.querySelector(`#${dias_semana[j].dia}_${tarde[i].periodo}`); 
                    if (item_horario &&
                        item_horario.children.length >= 3 &&
                        item_horario.children[0].dataset.id_disc != "" &&
                        item_horario.children[2].dataset.id_prof != "") {
                        
                        input_grade.push({
                            horario_inicio: tarde[i].horario_inicio,
                            horario_fim: tarde[i].horario_fim,
                            dia: dias_semana[j].id,
                            disciplina: item_horario.children[0].dataset.id_disc,
                            professor: item_horario.children[2].dataset.id_prof,
                            periodo: parseInt(input_periodo.value)
                        });              
                    }
                }   
            }
        }

        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if (input_sala.value === "") lista_validacao.push(input_sala.id);
        if (input_periodo.value === "") lista_validacao.push(input_periodo.id);

        if (input_grade.length == 0) {
            alert("Adicione pelo menos um Horario!");
        } else possui_grade = true;
        

        if (lista_validacao.length == 0 && possui_grade) {
           
            let obj = {
                ano: input_ano_letivo.value,
                serie: input_serie.value,
                turma: input_turma.value,
                sala: input_sala.value,
                grade: input_grade 
            };

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
        let input_periodo = document.querySelector('#slctPeriodo');
        let input_ano_letivo = document.querySelector("#slctAno");
        let input_serie = document.querySelector("#slctSerie");
        let input_turma = document.querySelector("#slctTurma");
        let input_sala = document.querySelector("#slctSala");
        let input_grade = [];
        let possui_grade = false;

        if(parseInt(input_periodo.value) == 1){
            for (let i = 0; i < manha.length; i++) {
                for (let j = 0; j < dias_semana.length; j++) {
                    let item_horario = document.querySelector(`#${dias_semana[j].dia}_${manha[i].periodo}`); 
                    if (item_horario && item_horario.dataset.id_item) {
                        if (item_horario &&
                            item_horario.children.length >= 3 &&
                            item_horario.children[0].dataset.id_disc != "" &&
                            item_horario.children[2].dataset.id_prof != "") {
                                
                            input_grade.push({
                                id_item: item_horario.dataset.id_item,
                                horario_inicio: manha[i].horario_inicio,
                                horario_fim: manha[i].horario_fim,
                                dia: dias_semana[j].id,
                                disciplina: item_horario.children[0].dataset.id_disc,
                                professor: item_horario.children[2].dataset.id_prof,
                                periodo: parseInt(input_periodo.value)
                            });
                        }   
                    } else {
                        if (item_horario &&
                            item_horario.children.length >= 3 &&
                            item_horario.children[0].dataset.id_disc != "" &&
                            item_horario.children[2].dataset.id_prof != "") {
                                
                            input_grade.push({
                                id_item: 0,
                                horario_inicio: manha[i].horario_inicio,
                                horario_fim: manha[i].horario_fim,
                                dia: dias_semana[j].id,
                                disciplina: item_horario.children[0].dataset.id_disc,
                                professor: item_horario.children[2].dataset.id_prof,
                                periodo: parseInt(input_periodo.value)
                            });
                        }   
                    }
                    
                }   
            }
        } else {
            for (let i = 0; i < tarde.length; i++) {
                for (let j = 0; j < dias_semana.length; j++) {
                    let item_horario = document.querySelector(`#${dias_semana[j].dia}_${tarde[i].periodo}`); 
                    if (item_horario && item_horario.dataset.id_item) {
                        if (item_horario &&
                            item_horario.children.length >= 3 &&
                            item_horario.children[0].dataset.id_disc != "" &&
                            item_horario.children[2].dataset.id_prof != "") {
                            
                            input_grade.push({
                                id_item: item_horario.dataset.id_item,
                                horario_inicio: tarde[i].horario_inicio,
                                horario_fim: tarde[i].horario_fim,
                                dia: dias_semana[j].id,
                                disciplina: item_horario.children[0].dataset.id_disc,
                                professor: item_horario.children[2].dataset.id_prof,
                                periodo: parseInt(input_periodo.value)
                            });              
                        }
                    } else {
                        if (item_horario &&
                            item_horario.children.length >= 3 &&
                            item_horario.children[0].dataset.id_disc != "" &&
                            item_horario.children[2].dataset.id_prof != "") {
                            
                            input_grade.push({
                                id_item: 0,
                                horario_inicio: tarde[i].horario_inicio,
                                horario_fim: tarde[i].horario_fim,
                                dia: dias_semana[j].id,
                                disciplina: item_horario.children[0].dataset.id_disc,
                                professor: item_horario.children[2].dataset.id_prof,
                                periodo: parseInt(input_periodo.value)
                            });              
                        }
                    }   
                }
            }
        }

        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if (input_serie.value === "") lista_validacao.push(input_serie.id);
        if (input_turma.value === "") lista_validacao.push(input_turma.id);
        if (input_sala.value === "") lista_validacao.push(input_sala.id);

        if (input_grade.length == 0) {
            alert("Adicione pelo menos um Horario!");
        } else possui_grade = true;
        

        if (lista_validacao.length == 0 && possui_grade) {
           
            let obj = {
                id_grade: input_id.value, 
                ano: input_ano_letivo.value,
                serie: input_serie.value,
                turma: input_turma.value,
                sala: input_sala.value,
                grade: input_grade 
            };

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
        let selecionou_dia = false;
        let diasSelecionados = [];
        
        document.querySelectorAll('.form-check-input.dia_semana:checked').forEach(checkbox => {
            diasSelecionados.push(checkbox.value);
        });

        let lista_validacao = [];

        if( (input_disciplina.value == "" && input_professor.value !== '') || (input_disciplina.value != "" && input_professor.value === '')){
            lista_validacao.push(input_disciplina.id);
            lista_validacao.push(input_professor.id);
        }

        if (input_horario.value === "") lista_validacao.push(input_horario.id);
        if (diasSelecionados.length == 0) {
            alert("Selecione um dia!");
        } else selecionou_dia = true;
        
        limpar_validacao();

        if(lista_validacao.length == 0 && selecionou_dia){
            for (let i = 0; i < diasSelecionados.length; i++) {
                let item_horario = document.querySelector(`#${diasSelecionados[i]}_${input_horario.value}`);            
                if (item_horario) {
                    
                    if(item_horario.children[0].dataset.id_disc){                        
                        if (confirm(`Certeza que deseja substituir o horario ${input_horario.selectedOptions[0].text} - ${diasSelecionados[i]}?`)) {
                            if(input_disciplina.value == "" && input_professor.value == ''){
                                item_horario.innerHTML = `
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>     
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
                                <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                <span data-id_prof=""><small>Professor: <br> ------</small></span>        
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

            input_horario.selectedIndex= 0;
            input_disciplina.selectedIndex= 0;
            input_professor.selectedIndex= 0;

            document.querySelectorAll('.form-check-input.dia_semana:checked').forEach(checkbox => {
                checkbox.checked = false;
            });
            
        }else {
            validar_campos(lista_validacao);
        }
       
    }
    
    function iniciar_tabela() {
        let input_periodo = document.querySelector("#slctPeriodo");
        let input_horario = document.querySelector("#slctHorario");
        let btn_horario = document.querySelector("#btn_modal_horario");

        btn_horario.disabled = false;

        if(!tabela_iniciada){
            tabela_iniciada = true;

            input_horario.innerHTML = `
                <option value="" selected disabled>Selecione um Horario</option>
            `;
            switch (parseInt(input_periodo.value)) {
                case 1:
                    for (let i = 0; i < manha.length; i++) {
                        let linha = document.querySelector("#horario_" + (i+1));
                        
                        if(i == 3){
                            linha.innerHTML = `
                                <td class="p-2 align-middle" id="hora_${i + 1}" >${manha[i].horario_inicio}/${manha[i].horario_fim}</td>
                                <td class="p-2" colspan="7" >
                                    <label class="text-dark text-center d-flex justify-content-center"><b>Intervalo</b></label>                     
                                </td>                            
                            `;
                        } else{
                            linha.innerHTML = `
                                <td class="p-2 align-middle" id="hora_${i + 1}" >${manha[i].horario_inicio}/${manha[i].horario_fim}</td>
                                <td class="p-2" id="dom_${i + 1}" >
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>                                   
                                </td>
                                <td class="p-2" id="seg_${i + 1}" >
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="ter_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="qua_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="qui_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="sex_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="sab_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                            `;
    
                            input_horario.innerHTML += `
                                <option value="${i + 1}">${manha[i].horario_inicio}/${manha[i].horario_fim}</option>
                            `;
                        }
                    }
                    break;
                case 2:
                    for (let i = 0; i < tarde.length; i++) {
                        let linha = document.querySelector("#horario_" + (i+1));
                        
                        if(i == 3){
                            linha.innerHTML = `
                                <td class="p-2 align-middle" id="hora_${i + 1}" >${tarde[i].horario_inicio}/${tarde[i].horario_fim}</td>
                                <td class="p-2" colspan="7" >
                                    <label class="text-dark text-center d-flex justify-content-center"><b>Intervalo</b></label>                                                               
                                </td>                            
                            `;
                        } else{
                            linha.innerHTML = `
                                <td class="p-2 align-middle" id="hora_${i + 1}" >${tarde[i].horario_inicio}/${tarde[i].horario_fim}</td>
                                <td class="p-2" id="dom_${i + 1}" >
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>                                   
                                </td>
                                <td class="p-2" id="seg_${i + 1}" >
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="ter_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="qua_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="qui_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="sex_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                                <td class="p-2" id="sab_${i + 1}" >                                
                                    <label class="text-dark" data-id_disc=""><b>------</b></label> <br>
                                    <span data-id_prof=""><small>Professor: <br> ------</small></span>   
                                </td>
                            `;
                            input_horario.innerHTML += `
                              <option value="${i + 1}">${tarde[i].horario_inicio}/${tarde[i].horario_fim}</option>
                            `;
                        }
                    }
    
                    break;
                    
                    
                default:
                    break;
            }        


        } else {
            input_horario.innerHTML = `
                <option value="" selected disabled>Selecione um Horario</option>
            `;
            switch (parseInt(input_periodo.value)) {
                case 1:
                    for (let i = 0; i < manha.length; i++) {
                        let horario_cell = document.querySelector("#hora_" + (i+1));
                        
                        horario_cell.innerHTML = `${manha[i].horario_inicio}/${manha[i].horario_fim}`;
                        input_horario.innerHTML += `
                            <option value="${i + 1}">${manha[i].horario_inicio}/${manha[i].horario_fim}</option>
                        `;
                    }
                    break;
                case 2:
                    for (let i = 0; i < tarde.length; i++) {
                        let horario_cell = document.querySelector("#hora_" + (i+1));
                        
                        horario_cell.innerHTML = `${tarde[i].horario_inicio}/${tarde[i].horario_fim}`;
                        input_horario.innerHTML += `
                            <option value="${i + 1}">${tarde[i].horario_inicio}/${tarde[i].horario_fim}</option>
                        `;
                    }
                    break;
                default:
                    break;
            }        
        }
    }    
    
    function iniciar_tabela_edicao() {
        let input_periodo = document.querySelector("#slctPeriodo");
        let input_horario = document.querySelector("#slctHorario");
        let btn_horario = document.querySelector("#btn_modal_horario");

        btn_horario.disabled = false;
        tabela_iniciada = true;

        input_horario.innerHTML = `
            <option value="" selected disabled>Selecione um Horario</option>
        `;

        let horarios = [];
        let periodo = parseInt(input_periodo.value);

        if (periodo === 1) {
            horarios = manha;
        } else if (periodo === 2) {
            horarios = tarde;
        } else {
            return;
        }

        for (let i = 0; i < horarios.length; i++) {
            let linha = document.querySelector("#horario_" + (i + 1));

            if (i === 3) {
                linha.innerHTML = `
                    <td class="p-2 align-middle" id="hora_${i + 1}" >${horarios[i].horario_inicio}/${horarios[i].horario_fim}</td>
                    <td class="p-2" colspan="7" >
                        <label class="text-dark text-center d-flex justify-content-center"><b>Intervalo</b></label>
                    </td>
                `;
            } else {
                let conteudo = `
                    <td class="p-2 align-middle" id="hora_${i + 1}" >${horarios[i].horario_inicio}/${horarios[i].horario_fim}</td>
                `;

                for (let dia = 0; dia < dias_semana.length; dia++) {
                    let horario_alterar = window.horarios_alterar.find(h =>
                        h.dia_semana === dia + 1 && h.horario_inicio === horarios[i].horario_inicio + ":00"
                    );

                    let disciplina = "------";
                    let professor = "------";

                    if (horario_alterar) {
                        disciplina = horario_alterar.disciplina;
                        professor = horario_alterar.professor;
                    }

                    conteudo += `
                        <td class="p-2" data-id_item="${horario_alterar?.id_item || ''}" id="${dias_semana[dia].dia}_${i + 1}" >
                            <label class="text-dark" data-id_disc="${horario_alterar?.id_disciplina || ''}"><b>${disciplina}</b></label> <br>
                            <span data-id_prof="${horario_alterar?.cpf_professor || ''}"><small>Professor: <br> ${professor}</small></span>
                        </td>
                    `;
                }

                linha.innerHTML = conteudo;

                input_horario.innerHTML += `
                    <option value="${i + 1}">${horarios[i].horario_inicio}/${horarios[i].horario_fim}</option>
                `;
            }            
        }
    }

    function atualizar_disciplina() {
        let resetar_tabela = false;
        if (serie_selecionada) {
            if(confirm("Ao trocar a Série, a Grade será zerada. \nDeseja realmente continuar?")){
                resetar_tabela = true;
            }
        }

        let input_serie = document.querySelector("#slctSerie");

        fetch("/disciplina_serie/obter_por_serie/" + input_serie.value, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((resposta) => resposta.json())
        .then((dados) => {
            if (dados.ok){
                let input_disciplina = document.querySelector("#slctDisciplina");
                for(let i=0; i < dados.lista.length; i++) {
                    let option = document.createElement("option");
                    if(resetar_tabela){
                        for (let j = 1; j < input_disciplina.options.length; j++) {                        
                            input_disciplina.remove(j); 
                        }
                    }
                    option.text = dados.lista[i].nome;
                    option.value = dados.lista[i].id_disciplina;
                    input_disciplina.add(option);
                }
                serie_selecionada = true;
                if(resetar_tabela){
                    tabela_iniciada = false;
                    iniciar_tabela();
                }
                let input_periodo = document.querySelector("#slctPeriodo");
                input_periodo.disabled = false;
            } 
        })
        .catch((erro) => console.error("erro:", erro));
    }

    document.querySelector("#btn_add_horario").addEventListener("click", add_horario);
    document.querySelector("#slctSerie").addEventListener("change", atualizar_disciplina);
    
    let input_usuario = document.querySelector("#hidden_grade").value;
    if (input_usuario == ""){
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
        document.querySelector("#slctPeriodo").addEventListener("change", iniciar_tabela);
    } else{
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
        iniciar_tabela_edicao();
        document.querySelector("#slctPeriodo").addEventListener("change", iniciar_tabela);
        atualizar_disciplina();
    }
});