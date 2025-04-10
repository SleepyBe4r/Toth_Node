

const express = require("express");
const Aluno_Controller = require("../controllers/aluno_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let aluno_C = new Aluno_Controller();
router.get("/", aluno_C.listar);
router.get("/cadastrar", aluno_C.cadastrar_view);
router.post("/cadastrar", aluno_C.cadastrar_aluno);
router.post("/excluir", aluno_C.excluir);

module.exports = router;