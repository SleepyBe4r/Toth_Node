
document.addEventListener("DOMContentLoaded", () => {
    const diasDaSemana = ["segunda", "terca", "quarta", "quinta", "sexta"];
const gradePorDia = {
      segunda: [],
      terca: [],
      quarta: [],
      quinta: [],
      sexta: []
    };

    function cadastrar() {
        let input_ano_letivo = document.querySelector("#txtAno");
        let lista_validacao = [];

        if (input_ano_letivo.value === "") lista_validacao.push(input_ano_letivo.id);
        if (lista_validacao.length == 0) {
            let obj = {
                ano_letivo: input_ano_letivo.value,
            }

            fetch("/ano_letivo/cadastrar", {
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

    function add_grade() {
        const disciplina = document.getElementById("disciplina").value;
        const professor = document.getElementById("professor").value;
        const horario = document.getElementById("horario").value;
        const sala = document.getElementById("sala").value;

        let disciplinasAdicionadas = [];

        diasDaSemana.forEach((dia) => {
            const checkbox = document.getElementById(dia.toLowerCase());

            if (checkbox.checked) {
                const existe = gradePorDia[dia].some(item => item.horario === horario);

                if (!existe) {
                    gradePorDia[dia].push({ disciplina, professor, horario, sala });
                    disciplinasAdicionadas.push(`${dia} às ${horario}`);
                }
            }
        });

        if (disciplinasAdicionadas.length > 0) {
            alert("Disciplinas adicionadas em: " + disciplinasAdicionadas.join(", "));
            document.getElementById("gradeForm").reset();
            atualizarTabelas();
        } else {
            alert("Nenhuma disciplina foi adicionada. Verifique os horários.");
        }

        // Limpa os checkboxes
        diasDaSemana.forEach((dia) => {
            document.getElementById(dia.toLowerCase()).checked = false;
        });
    }

    function verificar_turma() {
        let input_slctPeriodo = document.querySelector("#slctPeriodo");
        
        input_slctPeriodo.disabled = false;
    }

    function verificar_turno() {
        let input_cbSegunda = document.querySelector("#cbSegunda");
        let input_cbTerca = document.querySelector("#cbTerca");
        let input_cbQuarta = document.querySelector("#cbQuarta");
        let input_cbQuinta = document.querySelector("#cbQuinta");
        let input_cbSexta = document.querySelector("#cbSexta");
        let input_tmHorarioInicio = document.querySelector("#tmHorarioInicio");
        let input_tmHorarioFinal = document.querySelector("#tmHorarioFinal");
        let input_slctDisciplina = document.querySelector("#slctDisciplina");
        let input_slctProfessor = document.querySelector("#slctProfessor");

        input_cbSegunda.disabled = false;
        input_cbTerca.disabled = false;
        input_cbQuarta.disabled = false;
        input_cbQuinta.disabled = false;
        input_cbSexta.disabled = false;
        input_tmHorarioInicio.disabled = false;
        input_tmHorarioFinal.disabled = false;
        input_slctDisciplina.disabled = false;
        input_slctProfessor.disabled = false;
    }

    document.querySelector("#slctTurma").addEventListener("change", verificar_turma);
    document.querySelector("#slctPeriodo").addEventListener("change", verificar_turno);

    let btn_add_grade = document.querySelectorAll("#gradeForm");
    btn_add_grade.forEach(btn => {
        btn.addEventListener("click", add_grade);
    });

    let input_usuario = document.querySelector("#hidden_ano_letivo").value;
    if (input_usuario == "")
        document.querySelector("#btn_cadastro").addEventListener("click", cadastrar);
    else
        document.querySelector("#btn_atualizar").addEventListener("click", atualizar);
});