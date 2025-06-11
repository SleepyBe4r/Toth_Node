/**
 * Arquivo de validações específicas para o cadastro e edição de professores
 */

// Função para validar CPF
function validarCPF(cpf) {
    // Remover caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verificar se tem 11 dígitos
    if (cpf.length !== 11) {
        return { valido: false, mensagem: "CPF deve conter exatamente 11 dígitos" };
    }
    
    // Verificar se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cpf)) {
        return { valido: false, mensagem: "CPF inválido: dígitos repetidos" };
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
        return { valido: false, mensagem: "CPF inválido: primeiro dígito verificador incorreto" };
    }
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    
    if (digitoVerificador2 !== parseInt(cpf.charAt(10))) {
        return { valido: false, mensagem: "CPF inválido: segundo dígito verificador incorreto" };
    }
    
    return { valido: true };
}

// Função para validar telefone
function validarTelefone(telefone) {
    // Remover caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');
    
    // Verificar se tem entre 10 e 11 dígitos (com ou sem DDD)
    if (telefone.length < 10 || telefone.length > 11) {
        return { valido: false, mensagem: "Telefone deve conter entre 10 e 11 dígitos" };
    }
    
    // Verificar se não é um número negativo
    if (parseInt(telefone) <= 0) {
        return { valido: false, mensagem: "Telefone não pode ser um número negativo ou zero" };
    }
    
    return { valido: true };
}

// Função para validar nome (apenas letras e espaços)
function validarNome(nome) {
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(nome)) {
        return { valido: false, mensagem: "Nome deve conter apenas letras e espaços" };
    }
    
    if (nome.trim().length < 3) {
        return { valido: false, mensagem: "Nome deve ter pelo menos 3 caracteres" };
    }
    
    return { valido: true };
}

// Função para validar email
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        return { valido: false, mensagem: "Email inválido" };
    }
    return { valido: true };
}

// Função para validar data de nascimento
function validarDataNascimento(dataNascimento) {
    const data = new Date(dataNascimento);
    const hoje = new Date();
    
    // Verificar se é uma data válida
    if (isNaN(data.getTime())) {
        return { valido: false, mensagem: "Data de nascimento inválida" };
    }
    
    // Verificar se é uma data futura
    if (data > hoje) {
        return { valido: false, mensagem: "Data de nascimento não pode ser futura" };
    }
    
    // Verificar se a pessoa tem pelo menos 18 anos
    const idade = hoje.getFullYear() - data.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = data.getMonth();
    const diaNascimento = data.getDate();
    
    // Ajustar a idade se ainda não fez aniversário este ano
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        if (idade - 1 < 18) {
            return { valido: false, mensagem: "Professor deve ter pelo menos 18 anos" };
        }
    } else if (idade < 18) {
        return { valido: false, mensagem: "Professor deve ter pelo menos 18 anos" };
    }
    
    return { valido: true };
}

// Função para validar data de admissão
function validarDataAdmissao(dataAdmissao, dataNascimento) {
    const dataAdm = new Date(dataAdmissao);
    const dataNasc = new Date(dataNascimento);
    const hoje = new Date();
    
    // Verificar se é uma data válida
    if (isNaN(dataAdm.getTime())) {
        return { valido: false, mensagem: "Data de admissão inválida" };
    }
    
    // Verificar se é uma data futura
    if (dataAdm > hoje) {
        return { valido: false, mensagem: "Data de admissão não pode ser futura" };
    }
    
    // Calcular idade na data de admissão
    let idadeNaAdmissao = dataAdm.getFullYear() - dataNasc.getFullYear();
    const mesAdmissao = dataAdm.getMonth();
    const diaAdmissao = dataAdm.getDate();
    const mesNascimento = dataNasc.getMonth();
    const diaNascimento = dataNasc.getDate();
    
    // Ajustar a idade se ainda não tinha feito aniversário na data de admissão
    if (mesAdmissao < mesNascimento || (mesAdmissao === mesNascimento && diaAdmissao < diaNascimento)) {
        idadeNaAdmissao--;
    }
    
    // Verificar se tinha pelo menos 18 anos na data de admissão
    if (idadeNaAdmissao < 18) {
        return { valido: false, mensagem: "Professor deve ter pelo menos 18 anos na data de admissão" };
    }
    
    return { valido: true };
}

// Função para validar senha
function validarSenha(senha) {
    if (senha.length < 6) {
        return { valido: false, mensagem: "Senha deve ter pelo menos 6 caracteres" };
    }
    return { valido: true };
}

// Função principal para validar o formulário de professor
function validarFormularioProfessor(dados, isEdicao) {
    const erros = {};
    let valido = true;
    
    // Validar CPF
    const resultadoCPF = validarCPF(dados.cpf);
    if (!resultadoCPF.valido) {
        erros.cpf = resultadoCPF.mensagem;
        valido = false;
    }
    
    // Validar nome
    const resultadoNome = validarNome(dados.nome);
    if (!resultadoNome.valido) {
        erros.nome = resultadoNome.mensagem;
        valido = false;
    }
    
    // Validar email
    const resultadoEmail = validarEmail(dados.email);
    if (!resultadoEmail.valido) {
        erros.email = resultadoEmail.mensagem;
        valido = false;
    }
    
    // Validar telefone
    const resultadoTelefone = validarTelefone(dados.telefone);
    if (!resultadoTelefone.valido) {
        erros.telefone = resultadoTelefone.mensagem;
        valido = false;
    }
    
    // Validar data de nascimento
    const resultadoDataNascimento = validarDataNascimento(dados.dt_nascimento);
    if (!resultadoDataNascimento.valido) {
        erros.dt_nascimento = resultadoDataNascimento.mensagem;
        valido = false;
    }
    
    // Validar data de admissão
    if (dados.dt_nascimento && dados.dt_admissao) {
        const resultadoDataAdmissao = validarDataAdmissao(dados.dt_admissao, dados.dt_nascimento);
        if (!resultadoDataAdmissao.valido) {
            erros.dt_admissao = resultadoDataAdmissao.mensagem;
            valido = false;
        }
    }
    
    // Validar senha (apenas no cadastro)
    if (!isEdicao && dados.senha) {
        const resultadoSenha = validarSenha(dados.senha);
        if (!resultadoSenha.valido) {
            erros.senha = resultadoSenha.mensagem;
            valido = false;
        }
    }
    
    // Validar titulação
    if (!dados.titulacao) {
        erros.titulacao = "Titulação é obrigatória";
        valido = false;
    }
    
    return {
        valido: valido,
        erros: erros
    };
}
