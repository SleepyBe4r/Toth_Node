
const express = require("express");
const Aluno_Controller = require("../controllers/aluno_controller");
const Autenticacao = require("../middlewares/autenticacao");
const perfil_Controller = require("../controllers/perfil_controller")
const router = express.Router();

let perfil_C = new perfil_Controller()
let autentic = new Autenticacao();
let aluno_C = new Aluno_Controller();
router.get("/home", autentic.validar_Aluno, perfil_C.aluno_Perfil);
router.get("/", autentic.validar_Admin, aluno_C.listar);
router.get("/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_view);
router.post("/cadastrar", autentic.validar_Admin, aluno_C.cadastrar_aluno);
router.post("/excluir", autentic.validar_Admin, aluno_C.excluir);

module.exports = router;