document.addEventListener("DOMContentLoaded", function() {

    //adiciona o função ao click do botão
    document.getElementById("btn-filtrar").addEventListener("click", filtrar);    

    function filtrar() {

        //ler os campos e fazer o fetch;
        let ano = document.getElementById("slctAno");
        let serie = document.getElementById("slctSerie");
        let turma = document.getElementById("slctTurma");
        let bimestre = document.getElementById("slctBimestre");
        let disciplina = document.getElementById("slctDisciplina");

        fetch(`/quadro_notas/filtrar?ano=${ano.value}&serie=${serie.value}&turma=${turma.value}&bimestre=${bimestre.value}&disciplina=${disciplina.value}`)
        .then(resposta => {
            return resposta.json();
        })
        .then(corpoResposta => {
           //faz a montagem a tabela
           let html = ""; 
           for(let i = 0; i<corpoResposta.lista.length; i++) {        
                html += `                        
                    <tr>

                        <td><input type='checkbox' class='check_del' data-id="${corpoResposta.lista[i].id_quadro}" data-name="${corpoResposta.lista[i].id_quadro}"></td>
                        <td>${corpoResposta.lista[i].id_quadro}</td>
                        <td>${corpoResposta.lista[i].nome_ano}</td>
                        <td>${corpoResposta.lista[i].nome_serie}</td>
                        <td>${corpoResposta.lista[i].nome_turma}</td>
                        <td>${corpoResposta.lista[i].bimestre}</td>
                        <td>${corpoResposta.lista[i].nome_disciplina}</td>
                        <td>
                            <a href="/quadro_notas/editar/${corpoResposta.lista[i].id_quadro}" class="btn btn-primary">
                                Editar
                            </a>
                            <button class="btn btn-danger excluir" data-id="${corpoResposta.lista[i].id_quadro}" data-name="${corpoResposta.lista[i].id_quadro}">Excluir</button>
                        </td>
                    </tr>
                `
           }
           //substitui o corpo da tabela
           document.getElementById("corpoTabelaQuadro").innerHTML = html;
        })
    }
})