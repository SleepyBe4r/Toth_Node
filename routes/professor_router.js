const express = require("express");
const Professor_Controller = require("../controllers/professor_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let professor_C = new Professor_Controller();

// Rota para a página inicial do professor (acessível apenas para professores)
router.get("/home", autentic.validar_Professor, professor_C.home_view);

// Rotas para CRUD de professores na área do professor
router.get("/", autentic.validar_Professor, professor_C.home_view);
router.get("/cadastrar", autentic.validar_Professor, professor_C.listar_cadastroProf);
router.post("/cadastrar", autentic.validar_Professor, professor_C.cadastrar_Prof);
router.get("/editar/:cpf", autentic.validar_Professor, professor_C.listar_editar);
router.post("/editar", autentic.validar_Professor, professor_C.editar_Prof);
router.post("/excluir", autentic.validar_Professor, professor_C.excluir_Prof);

module.exports = router;