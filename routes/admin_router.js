
const express = require("express");
const Admin_Controller = require("../controllers/admin_controller");
const Professor_Controller = require("../controllers/professor_controller");
const Autenticacao = require("../middlewares/autenticacao");
const Aluno_Controller = require("../controllers/aluno_controller");

const router = express.Router();

let autentic = new Autenticacao();
let admin_C = new Admin_Controller();
let professor_C = new Professor_Controller();
let aluno_C = new Aluno_Controller();
// Rotas de administração geral
router.get("/home", autentic.validar_Admin, admin_C.home_view);

// Rotas de gerenciamento de professores
router.get("/professores", autentic.validar_Admin, professor_C.listar_view_admin);
router.get("/professores/cadastrar", autentic.validar_Admin, professor_C.listar_cadastroProf_admin);
router.post("/professores/cadastrar", autentic.validar_Admin, professor_C.cadastrar_Prof);
router.post("/professores/excluir", autentic.validar_Admin, professor_C.excluir_Prof);
router.get("/professores/editar/:cpf", autentic.validar_Admin, professor_C.listar_editar_admin);
router.post("/professores/editar", autentic.validar_Admin, professor_C.editar_Prof);

// Rotas de gerenciamento de alunos
router.get("/alunos", autentic.validar_Admin, aluno_C.listar_view_admin);
router.get("/alunos/cadastrar", autentic.validar_Admin, aluno_C.listar_cadastroAluno_admin);
router.post("/alunos/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_Aluno);
router.post("/alunos/excluir", autentic.validar_Admin, aluno_C.excluir_Aluno);
router.get("/alunos/editar/:cpf", autentic.validar_Admin, aluno_C.listar_editar_admin);
router.post("/alunos/editar", autentic.validar_Admin, aluno_C.editar_Aluno);

module.exports = router;