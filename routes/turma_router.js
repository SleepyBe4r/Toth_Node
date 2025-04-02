

const express = require("express");
const Turma_Controller = require("../controllers/turma_controller");

const router = express.Router();

let turma_C = new Turma_Controller();
router.get("/", turma_C.listar_view);
router.get("/cadastrar", turma_C.listar_cadastro);
router.post("/cadastrar", turma_C.cadastrar_turma);
router.post("/excluir", turma_C.excluir_turma);
router.get("/editar/:id", turma_C.listar_editar);
router.post("/editar", turma_C.editar_turma);
router.post("/ObterPorDisc", turma_C.ObterPorDisc);

module.exports = router;