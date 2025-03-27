document.addEventListener("DOMContentLoaded", () => {
    let btns = document.querySelectorAll(".excluir");
    for (let btn of btns){
        btn.addEventListener("click", excluir);
    }

    function excluir(){
        const cpf = this.dataset.cpf;
        const convenio = this.dataset.convenio;

        let obj = {
            cpf: cpf
        }

        if(confirm(`Deseja realmente excluir o usuário ${cpf}?`)){
            const that = this;
            fetch("/aluno/excluir",{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((resposta) => {
                return resposta.json();
            })
            .then((dados) =>{
                alert(dados.msg);
                if(dados.ok){
                    that.parentElement.parentElement.remove();
                }
            })
            .catch((erro) => {
                console.log(erro);
            })
        }
    }
});