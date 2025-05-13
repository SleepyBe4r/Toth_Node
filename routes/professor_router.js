const express = require("express");
const Professor_Controller = require("../controllers/professor_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let professor_C = new Professor_Controller();
router.get("/home", autentic.validar_Professor, professor_C.home_view);
router.get("/", autentic.validar_Admin, professor_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, professor_C.listar_cadastroProf);
router.post("/cadastrar", autentic.validar_Admin, professor_C.cadastrar_Prof);
router.post("/excluir", autentic.validar_Admin, professor_C.excluir_Prof);
router.get("/editar/:cpf", autentic.validar_Admin, professor_C.listar_editar);
router.post("/editar", autentic.validar_Admin, professor_C.editar_Prof);

module.exports = router;