

const express = require("express");
const Turma_Controller = require("../controllers/turma_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let turma_C = new Turma_Controller();
router.get("/", autentic.validar_Admin, turma_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, turma_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Admin, turma_C.cadastrar_turma);
router.post("/excluir", autentic.validar_Admin, turma_C.excluir_turma);
router.get("/editar/:id", autentic.validar_Admin, turma_C.listar_editar);
router.post("/editar", autentic.validar_Admin, turma_C.editar_turma);
router.post("/ObterPorDisc", autentic.validar_Admin, turma_C.ObterPorDisc);

module.exports = router;