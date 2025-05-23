
document.addEventListener("DOMContentLoaded", ()=>{

    function excluir(e, grade_id, turma, linha){ 

        if(typeof grade_id == "undefined" && typeof turma == "undefined" ){
            grade_id = this.dataset.id;
            turma = this.dataset.name;
            linha = this.parentElement.parentElement;
        } 
        
        let obj = {
            id: grade_id
        };

        if (confirm(`Deseja realmente EXCLUIR a grade da turma ${turma}`)) {
            fetch("/grade/excluir",{
               method:"POST",
               headers:{
                    "Content-Type":"application/json"
               },
               body: JSON.stringify(obj)
            })
            .then((resposta) => resposta.json())
            .then((dados)=>{
                if(dados.ok) {
                    alert(`A grade da turma ${turma} foi excluida!`);
                    linha.style.transition = '.5s';
                    linha.style.opacity = '0';
                    setTimeout(()=> linha.remove(), 500);
                }
                else alert("Erro ao excluir a grade");
            })
            .catch((erro) => console.error("erro:" ,erro));    
        }
    }

    function selecionar_todos() {
        let check_box_all = document.querySelector("#ckTodos");
        let check_list = document.querySelectorAll(".check_del");
        if(check_box_all.checked){
            check_list.forEach(ck_item => {
                ck_item.checked = check_box_all.checked;
            });
        } else{
            for (let ck_item of check_list) {
                ck_item.checked = check_box_all.checked;
            }
        }
    }

    function excluir_selecionados() {
        let grade_id;
        let turma;
        let check_list = document.querySelectorAll(".check_del");

        if (check_list.length > 0) {
            check_list.forEach(ck_item => {
                grade_id = ck_item.dataset.id;
                turma = ck_item.dataset.name;
                let linha = ck_item.parentElement.parentElement;
                if(ck_item.checked){ excluir(0, grade_id, turma, linha); }
            });        
        } else { alert("Não há item para ser excluído")}

        let check_box_all = document.querySelector("#ckTodos");
        check_box_all.checked = false;
    }

    let botoes_excluir = document.querySelectorAll(".btn.btn-danger.excluir");
    botoes_excluir.forEach(e => {
       e.addEventListener("click", excluir); 
    });

    let check_todos = document.querySelector("#ckTodos");
    check_todos.addEventListener("click", selecionar_todos);

    let botao_excluir_todos = document.querySelector("#btnExcluirSelecionados");
    botao_excluir_todos.addEventListener("click", excluir_selecionados); 
})