/**
 * Arquivo de validações e utilitários para o CRUD de professores
 * Contém funções para validar CPF, telefone, nome, email, data de admissão e outros campos
 */

/**
 * Valida um CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se o CPF for válido, false caso contrário
 */
function validarCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (CPF inválido, mas passa na validação matemática)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let resto = soma % 11;
  let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
  
  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
    return false;
  }
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  resto = soma % 11;
  let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
  
  return digitoVerificador2 === parseInt(cpf.charAt(10));
}

/**
 * Valida um telefone
 * @param {string} telefone - Telefone a ser validado
 * @returns {boolean} - true se o telefone for válido, false caso contrário
 */
function validarTelefone(telefone) {
  // Remove caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
  if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
    return false;
  }
  
  // Verifica se o DDD é válido (se tiver 11 dígitos)
  if (numeroLimpo.length === 11) {
    const ddd = numeroLimpo.substring(0, 2);
    if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
      return false;
    }
  }
  
  return true;
}

/**
 * Valida um nome (apenas letras e espaços)
 * @param {string} nome - Nome a ser validado
 * @returns {boolean} - true se o nome for válido, false caso contrário
 */
function validarNome(nome) {
  // Verifica se contém apenas letras (incluindo acentuadas) e espaços
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(nome) && nome.trim().length > 0;
}

/**
 * Valida um email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se o email for válido, false caso contrário
 */
function validarEmail(email) {
  // Expressão regular para validar email
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email);
}

/**
 * Valida uma data de admissão (não pode ser futura)
 * @param {string} data - Data a ser validada no formato YYYY-MM-DD
 * @returns {boolean} - true se a data for válida, false caso contrário
 */
function validarDataAdmissao(data) {
  const dataAdmissao = new Date(data);
  const hoje = new Date();
  
  // Zera as horas para comparar apenas as datas
  hoje.setHours(0, 0, 0, 0);
  dataAdmissao.setHours(0, 0, 0, 0);
  
  // Verifica se a data é válida e não é futura
  return !isNaN(dataAdmissao.getTime()) && dataAdmissao <= hoje;
}

/**
 * Valida uma data de nascimento (deve ter pelo menos 18 anos)
 * @param {string} data - Data a ser validada no formato YYYY-MM-DD
 * @returns {boolean} - true se a data for válida, false caso contrário
 */
function validarDataNascimento(data) {
  const dataNascimento = new Date(data);
  const hoje = new Date();
  
  // Verifica se a data é válida
  if (isNaN(dataNascimento.getTime())) {
    return false;
  }
  
  // Calcula a idade
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = dataNascimento.getMonth();
  const diaNascimento = dataNascimento.getDate();
  
  // Ajusta a idade se ainda não fez aniversário no ano atual
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }
  
  // Verifica se tem pelo menos 18 anos
  return idade >= 18;
}

/**
 * Valida uma titulação
 * @param {string} titulacao - Titulação a ser validada
 * @returns {boolean} - true se a titulação for válida, false caso contrário
 */
function validarTitulacao(titulacao) {
  const titulacoesValidas = ['graduado', 'especialista', 'mestre', 'doutor'];
  return titulacoesValidas.includes(titulacao);
}

/**
 * Valida o formulário completo de professor
 * @param {Object} dados - Dados do formulário
 * @param {boolean} modoEdicao - true se for modo de edição, false se for cadastro
 * @returns {Object} - Objeto com resultado da validação
 */
function validarFormularioProfessor(dados, modoEdicao) {
  const erros = {};
  
  // No modo de cadastro, validamos todos os campos
  if (!modoEdicao) {
    // Validar CPF
    if (!dados.cpf || !validarCPF(dados.cpf)) {
      erros.cpf = "CPF inválido";
    }
    
    // Validar data de nascimento
    if (!dados.dt_nascimento || !validarDataNascimento(dados.dt_nascimento)) {
      erros.dt_nascimento = "Data de nascimento inválida (deve ter pelo menos 18 anos)";
    }
    
    // Validar rua e bairro
    if (!dados.rua || dados.rua.trim() === '') {
      erros.rua = "Rua é obrigatória";
    }
    
    if (!dados.bairro || dados.bairro.trim() === '') {
      erros.bairro = "Bairro é obrigatório";
    }
    
    // Validar senha
    if (!dados.senha || dados.senha.length < 6) {
      erros.senha = "Senha deve ter pelo menos 6 caracteres";
    }
    
    // Validar data de admissão
    if (!dados.dt_admissao || !validarDataAdmissao(dados.dt_admissao)) {
      erros.dt_admissao = "Data de admissão inválida (não pode ser futura)";
    }
  }
  
  // Validações comuns para cadastro e edição
  
  // Validar nome
  if (!dados.nome || !validarNome(dados.nome)) {
    erros.nome = "Nome deve conter apenas letras e espaços";
  }
  
  // Validar email
  if (!dados.email || !validarEmail(dados.email)) {
    erros.email = "Email inválido";
  }
  
  // Validar telefone
  if (!dados.telefone || !validarTelefone(dados.telefone)) {
    erros.telefone = "Telefone inválido";
  }
  
  // Validar titulação
  if (!dados.titulacao || !validarTitulacao(dados.titulacao)) {
    erros.titulacao = "Titulação inválida";
  }
  
  return {
    valido: Object.keys(erros).length === 0,
    erros: erros
  };
}

// Exportar funções para uso global
window.validarCPF = validarCPF;
window.validarTelefone = validarTelefone;
window.validarNome = validarNome;
window.validarEmail = validarEmail;
window.validarDataAdmissao = validarDataAdmissao;
window.validarDataNascimento = validarDataNascimento;
window.validarTitulacao = validarTitulacao;
window.validarFormularioProfessor = validarFormularioProfessor;
