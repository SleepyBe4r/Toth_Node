const express = require("express");
const Professor_Controller = require("../controllers/professor_controller");

const router = express.Router();

let professor_C = new Professor_Controller();
router.get("/", professor_C.listar_view);
router.get("/cadastrar", professor_C.listar_cadastroProf);
router.post("/cadastrar", professor_C.cadastrar_Prof);
router.post("/excluir", professor_C.excluir_Prof);
router.get("/editar/:cpf", professor_C.listar_editar);
router.post("/editar", professor_C.editar_Prof);

module.exports = router;