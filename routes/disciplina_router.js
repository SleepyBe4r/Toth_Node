

const express = require("express");
const Disciplina_Controller = require("../controllers/disciplina_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let disciplina_C = new Disciplina_Controller();
router.get("/", autentic.validar_Admin, disciplina_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, disciplina_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Admin, disciplina_C.cadastrar_disciplina);
router.post("/excluir", autentic.validar_Admin, disciplina_C.excluir_disciplina);
router.get("/editar/:id", autentic.validar_Admin, disciplina_C.listar_editar);
router.post("/editar", autentic.validar_Admin, disciplina_C.editar_disciplina);

module.exports = router;