const express = require("express");
const perfil_Controller = require("../controllers/perfil_controller")
const Autenticacao = require("../middlewares/autenticacao");
const router = express.Router();

let perfil_C = new perfil_Controller()
let autentic = new Autenticacao();

router.get("/alunoP", autentic.validar_Aluno, perfil_C.aluno_Perfil)
router.get("/professorP", autentic.validar_Professor, perfil_C.professor_Perfil)
router.get("/adminP", autentic.validar_Admin, perfil_C.admin_Perfil)

module.exports = router;


