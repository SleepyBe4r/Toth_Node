
function mMoeda () {
    // Para pegar o objeto que chamou o evento 
    //var v = (event.target.value).substring(3); //extrai os 3 primeiros caracteres relativos ao 'R$ '
    var v = event.target.value;
                
    //Faz uma série de substituições nas Expressões Regulares que podem gerar valores monetários
    v = v.replace(/\D/g, "");
    v = v.replace(/^0+/g, "");
    v = v.replace(/(\d{1})(\d{13})$/, "$1.$2");
    v = v.replace(/(\d{1})(\d{10})$/, "$1.$2");
    v = v.replace(/(\d{1})(\d{7})$/, "$1.$2");
    v = v.replace(/(\d{1})(\d{4})$/, "$1.$2");
    v = v.replace(/(\d{1})(\d{1,1})$/, "$1,$2");
    // Para retornar os valores que estão sendo digitados com a formatação ao elemento que chamou a função
    event.target.value = "R$ " + v;
    // event.target.value = v;
}

function mTel () {
    var tel = event.target.value;
    tel = tel.replace(/\D/g, "")
    tel = tel.replace(/^(\d)/, "($1")
    tel = tel.replace(/(.{3})(\d)/, "$1)$2")
    if (tel.length == 9) {
    tel = tel.replace(/(.{1})$/, "-$1")
    } else if (tel.length == 10) {
    tel = tel.replace(/(.{2})$/, "-$1")
    } else if (tel.length == 11) {
    tel = tel.replace(/(.{3})$/, "-$1")
    } else if (tel.length == 12) {
    tel = tel.replace(/(.{4})$/, "-$1")
    } else if (tel.length > 12) {
    tel = tel.replace(/(.{4})$/, "-$1")
    }
   

}
        
function mCEP () {
    var cep = event.target.value;
    cep = cep.replace(/\D/g, "")
    cep = cep.replace(/^(\d{2})(\d)/, "$1.$2")
    cep = cep.replace(/.(\d{3})(\d)/, ".$1-$2")
    event.target.value = cep;
}

// Validar CPF - Andressa
function validarCPF(erro_obj) {
    var cpf = event.target.value;
    var ok = 1;
    var add;
    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";
    if (cpf != "") {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
            ok = 0;
    if (ok == 1) {
        add = 0;
        for (i = 0; i < 9; i++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(9)))
                ok = 0;
            if (ok == 1) {
                add = 0;
                for (i = 0; i < 10; i++)
                add += parseInt(cpf.charAt(i)) * (11 - i);
                rev = 11 - (add % 11);
                if (rev == 10 || rev == 11)
                rev = 0;
                if (rev != parseInt(cpf.charAt(10)))
                ok = 0;
            }
        }
        if (ok == 0) {
            erro_obj.innerHTML = "CPF inválido!";
        }
    }
}

function validarEmail(email_obj, erro_obj) {
    const email = email_obj.value;

    // Regex para cada parte do e-mail
    const temArroba = /@/;
    const antesDoArroba = /^[^\s@]+/;
    const aposArroba = /@[^\s@]+\./;
    const dominioValido = /\.[^\s@]+$/;

    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";

    // Validações específicas
    if (!temArroba.test(email)) {
        erro_obj.innerHTML = "O e-mail deve conter o caractere '@'.";        
        return false;
    }

    if (!antesDoArroba.test(email)) {
        erro_obj.innerHTML = "O e-mail deve conter texto antes do '@'.";        
        return false;
    }

    if (!aposArroba.test(email)) {
        erro_obj.innerHTML = "O e-mail deve conter um domínio válido após o '@' (por exemplo, exemplo.com).";        
        return false;
    }

    if (!dominioValido.test(email)) {
        erro_obj.innerHTML = "O e-mail deve terminar com um domínio válido (por exemplo, '.com').";              
        return false;
    }

    return true; // Permite o envio do formulário
}

function validarSenha(senha_obj, erro_obj) {
    const senha = senha_obj.value;

    // Critérios de validação
    const temMinimoOitoCaracteres = /^.{8,}$/;
    const temLetraMaiuscula = /[A-Z]/;
    const temLetraMinuscula = /[a-z]/;
    const temNumero = /[0-9]/;
    const temCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";

    // Validações específicas com alertas
    if (!temMinimoOitoCaracteres.test(senha)) {
      erro_obj.innerHTML = "A senha deve ter pelo menos 8 caracteres.";
      return false;
      
    }

    if (!temLetraMaiuscula.test(senha)) {
      erro_obj.innerHTML = "A senha deve conter pelo menos uma letra maiúscula.";
      return false;
    }

    if (!temLetraMinuscula.test(senha)) {
      erro_obj.innerHTML = "A senha deve conter pelo menos uma letra minúscula.";
      return false;
    }

    if (!temNumero.test(senha)) {
      erro_obj.innerHTML = "A senha deve conter pelo menos um número.";
      return false;
    }

    if (!temCaractereEspecial.test(senha)) {
      erro_obj.innerHTML = "A senha deve conter pelo menos um caractere especial (ex: !@#$%^&*).";
      return false;
    }

    return true; // Permite o envio do formulário
}

function validarComfirmarSenha(senha_obj,confirma_senha_obj,erro_obj) {    

    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";

    if(senha_obj.value != confirma_senha_obj.value){
        erro_obj.innerHTML = "As senhas não coincidem. Por favor, tente novamente.";
        return false;
    }

    return true; // Permite o envio do formulário
}

function validarDataNascimentoAluno(data_obj,erro_obj) {
    const dataNascimento = data_obj.value;
    
    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";

    if (!dataNascimento) {
      erro_obj.innerHTML = "Por favor, informe a data de nascimento.";
      return false; 
    }

    const dataAtual = new Date();
    const dataNascimentoObj = new Date(dataNascimento);

    // Calculando a diferença de idade
    let idade = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
    const mes = dataAtual.getMonth() - dataNascimentoObj.getMonth();
    
    if (mes < 0 || (mes === 0 && dataAtual.getDate() < dataNascimentoObj.getDate())) {
      idade--;
    }

    // Verifica se a idade está entre 6 e 14 anos
    if (idade < 6 || idade > 14) {
      erro_obj.innerHTML = "A idade do aluno deve estar entre 6 e 14 anos.";
      return false;
    }

    // Se passou em todas as validações, envia o formulário
    return true;
}

function validarDataNascimentoAdulto(data_obj,erro_obj) {
    const dataNascimento = data_obj.value;
    
    // Limpar qualquer erro anterior
    erro_obj.innerHTML = "";

    if (!dataNascimento) {
      erro_obj.innerHTML = "Por favor, informe a data de nascimento.";
      return false;
    }

    const dataAtual = new Date();
    const dataNascimentoObj = new Date(dataNascimento);

    // Calculando a diferença de idade
    let idade = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
    const mes = dataAtual.getMonth() - dataNascimentoObj.getMonth();
    
    if (mes < 0 || (mes === 0 && dataAtual.getDate() < dataNascimentoObj.getDate())) {
      idade--;
    }

    // Verifica se a idade está acima de 18 anos
    if (idade < 18) {
      erro_obj.innerHTML = "A idade deve ser maior de 18 anos.";
      return false;
    }

    // Se passou em todas as validações, envia o formulário    
    return true;
}

function validarDatas(data_inicio_obj, data_fim_obj, erro_obj) {
  const dtInicio = data_inicio_obj.value;
  const dtFim = data_fim_obj.value;

  // Limpar qualquer erro anterior
  erro_obj.innerHTML = "";

  // Verificar se as datas foram preenchidas
  if (!dtInicio || !dtFim) {
    erro_obj.innerHTML = "Por favor, preencha ambas as datas (Início e Fim).";
    return false;
  }

  // Converter as datas para objetos Date (apenas ano-mês-dia)
  const [anoInicio, mesInicio, diaInicio] = dtInicio.split('-').map(Number);
  const [anoFim, mesFim, diaFim] = dtFim.split('-').map(Number);

  const dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio);
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);

  // Data de hoje (sem horário)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Verificar se as datas são válidas
  if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
    erro_obj.innerHTML = "Por favor, insira datas válidas.";
    return false;
  }

  // Verificar se a data de início é maior que a data de fim
  if (dataInicio > dataFim) {
    erro_obj.innerHTML = "A data de início não pode ser posterior à data de fim.";
    return false;
  }

  // Verificar se a data de início ou de fim são anteriores à data atual
  if (dataInicio < hoje || dataFim < hoje) {
    erro_obj.innerHTML = "As datas não podem ser anteriores à data de hoje.";
    return false;
  }

  return true;
}



/*
fonte: https://github.com/FlavioALeal/MascaraJS

Parametros da função mascara
A função máscara tem 3 parametros.

1º - o Modelo da máscara utilizado no input, como explicado acima, informe sempre a máscara entre aspas simples ou aspas duplas, parametro obrigatório
2º - não mude, sempre deve ser this, parametro obrigatório
3º - não mude, sempre deve ser event, parametro obrigatório
*/
function mascara(m,t,e){
    var cursor = t.selectionStart;
    var texto = t.value;
    texto = texto.replace(/\D/g,'');
    var l = texto.length;
    var lm = m.length;
    if(window.event) {                  
        id = e.keyCode;
    } else if(e.which){                 
        id = e.which;
    }
    cursorfixo=false;
    if(cursor < l)cursorfixo=true;
    var livre = false;
    if(id == 16 || id == 19 || (id >= 33 && id <= 40))livre = true;
    ii=0;
    mm=0;
    if(!livre){
        if(id!=8){
            t.value="";
            j=0;
            for(i=0;i<lm;i++){
                if(m.substr(i,1)=="#"){
                t.value+=texto.substr(j,1);
                j++;
                }else if(m.substr(i,1)!="#"){
                        t.value+=m.substr(i,1);
                    }
                    if(id!=8 && !cursorfixo)cursor++;
                    if((j)==l+1)break;
                        
            } 	
        }
    }
    if(cursorfixo && !livre)cursor--;
        t.setSelectionRange(cursor, cursor);
        
}
        
function limpar_validacao(){
  let inputs = document.querySelectorAll("input" +  
  ",select");
  inputs.forEach(e => {
      e.classList.remove("border-danger");
  });
}

function validar_campos(lista){
  limpar_validacao();
  
  for (let i = 0; i < lista.length; i++) {
      let input = document.querySelector("#"+lista[i]);
      input.classList.add("border-danger");
  }
}