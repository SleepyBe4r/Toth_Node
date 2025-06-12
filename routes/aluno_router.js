const express = require("express");

const Aluno_Controller = require("../controllers/aluno_controller");
const Autenticacao = require("../middlewares/autenticacao");
const perfil_Controller = require("../controllers/perfil_controller");
const router = express.Router();

let perfil_C = new perfil_Controller()
let autentic = new Autenticacao();
let aluno_C = new Aluno_Controller();
router.get("/home", autentic.validar_Aluno, perfil_C.aluno_Perfil);
router.get("/", autentic.validar_Admin, aluno_C.listar_view_admin);
router.get("/cadastrar", autentic.validar_Admin, aluno_C.listar_cadastroAluno_admin);
router.post("/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_Aluno);
router.get("/editar/:cpf", autentic.validar_Admin, aluno_C.listar_editar_admin);
router.post("/editar", autentic.validar_Admin, aluno_C.editar_Aluno);
router.post("/excluir", autentic.validar_Admin, aluno_C.excluir_Aluno);

module.exports = router;