

const express = require("express");
const Grade_Curricular_Controller = require("../controllers/grade_curricular_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let grade_curriculo_C = new Grade_Curricular_Controller();
router.get("/", autentic.validar_Admin, grade_curriculo_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, grade_curriculo_C.cadastro_view);
router.post("/cadastrar", autentic.validar_Admin, grade_curriculo_C.cadastrar_grade_curricular);
router.get("/editar/:id", grade_curriculo_C.editar_view);
router.post("/editar", grade_curriculo_C.editar_grade_curricular);
// router.post("/excluir", ano_letivo_C.excluir_ano_letivo);

module.exports = router;