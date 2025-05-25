

const express = require("express");
const Grade_Controller = require("../controllers/grade_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let grade_C = new Grade_Controller();
router.get("/", autentic.validar_Admin, grade_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, grade_C.cadastro_view);
router.post("/cadastrar", autentic.validar_Admin, grade_C.cadastrar_grade);
router.get("/editar/:id", grade_C.editar_view);
router.post("/editar", grade_C.editar_grade);
router.post("/excluir", grade_C.excluir_grade);

module.exports = router;