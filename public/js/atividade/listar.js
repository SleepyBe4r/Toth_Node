document.addEventListener("DOMContentLoaded", function() {

    //adiciona o função ao click do botão
    document.getElementById("btn-filtrar").addEventListener("click", filtrar);    

    function filtrar() {

        //ler os campos e fazer o fetch;
        let termo = document.getElementById("input-filtro");

        fetch(`/atividade/filtrar?termo=${termo.value}`)
        .then(resposta => {
            return resposta.json();
        })
        .then(corpoResposta => {
           //faz a montagem a tabela
           let html = ""; 
           for(let i = 0; i<corpoResposta.lista.length; i++) {        
                const item = corpoResposta.lista[i];
                const dtInicio = new Date(item.dt_inicio).toLocaleDateString('pt-BR');
                const dtFinal = new Date(item.dt_final).toLocaleDateString('pt-BR');
                const verMaisBtn = item.id_quadro == null
                    ? `<a href="#" class="btn btn-info disabled">Ver mais</a>`
                    : `<a href="/atividade/ver_mais_P/${item.id_atividade}" class="btn btn-info">Ver mais</a>`;

                html += `
                    <tr>
                    <td>
                        <input type='checkbox' class='check_del' data-id="${item.id_quadro}" data-name="${item.id_quadro}">
                    </td>
                    <td>${item.id_atividade}</td>
                    <td>${item.nome}</td>
                    <td>${dtInicio}</td>
                    <td>${dtFinal}</td>
                    <td>
                        ${verMaisBtn}
                        <a href="/atividade/editar/${item.id_atividade}" class="btn btn-primary">Editar</a>
                        <button class="btn btn-danger excluir" data-id="${item.id_atividade}" data-name="${item.nome}">Excluir</button>
                    </td>
                    </tr>
                `;
           }
           //substitui o corpo da tabela
           document.getElementById("corpoTabelaQuadro").innerHTML = html;
        })
    }
})