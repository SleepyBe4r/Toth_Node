

const express = require("express");
const Atividade_Controller = require("../controllers/atividade_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let atividade_C = new Atividade_Controller();
router.get("/P_listar", autentic.validar_Professor, atividade_C.listar_view_professor);
router.get("/A_listar", autentic.validar_Aluno, atividade_C.listar_view_aluno);
router.get("/cadastrar", autentic.validar_Professor, atividade_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Professor, atividade_C.cadastrar_atividade);
router.get("/ver_mais_A/:id", autentic.validar_Aluno, atividade_C.listar_ver_mais_A);
router.post("/responder", autentic.validar_Aluno, atividade_C.responder_atividade);
//router.post("/excluir", atividade_C.excluir_ano_letivo);
//router.get("/editar/:id", atividade_C.listar_editar);
//router.post("/editar", atividade_C.editar_ano_letivo);

module.exports = router;