

const express = require("express");
const Sala_Controller = require("../controllers/sala_controller");

const router = express.Router();

let sala_C = new Sala_Controller();
router.get("/", sala_C.listar_view);
router.get("/cadastrar", sala_C.listar_cadastro);
router.post("/cadastrar", sala_C.cadastrar_sala);
router.post("/excluir", sala_C.excluir_ano_letivo);
router.get("/editar/:id", sala_C.listar_editar);
router.post("/editar", sala_C.editar_sala);

module.exports = router;