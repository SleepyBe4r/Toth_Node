

const express = require("express");
const Grade_Curricular_Controller = require("../controllers/grade_curricular_controller");

const router = express.Router();

let grade_curriculo_C = new Grade_Curricular_Controller();
// router.get("/", ano_letivo_C.listar_view);
router.get("/cadastrar", grade_curriculo_C.listar_cadastro);
// router.post("/cadastrar", ano_letivo_C.cadastrar_ano_letivo);
// router.post("/excluir", ano_letivo_C.excluir_ano_letivo);
// router.get("/editar/:id", ano_letivo_C.listar_editar);
// router.post("/editar", ano_letivo_C.editar_ano_letivo);

module.exports = router;