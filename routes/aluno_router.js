
const express = require("express");
const Aluno_Controller = require("../controllers/aluno_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let aluno_C = new Aluno_Controller();
router.get("/home", autentic.validar_Aluno, aluno_C.home_view);
router.get("/", autentic.validar_Admin, aluno_C.listar);
router.get("/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_view);
router.post("/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_aluno);
router.post("/excluir", autentic.validar_Admin, aluno_C.excluir);

module.exports = router;