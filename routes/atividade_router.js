

const express = require("express");
const Atividade_Controller = require("../controllers/atividade_controller");
const Autenticacao = require("../middlewares/autenticacao");
const multer = require('multer');
let autentic = new Autenticacao();

let upload = multer({});
const router = express.Router();

let atividade_C = new Atividade_Controller();
router.get("/P_listar", autentic.validar_Professor, atividade_C.listar_view_professor);
router.get("/A_listar", autentic.validar_Aluno, atividade_C.listar_view_aluno);
router.get("/cadastrar", autentic.validar_Professor, atividade_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Professor, atividade_C.cadastrar_atividade);
router.get("/ver_mais_A/:id", autentic.validar_Aluno, atividade_C.listar_ver_mais_A);
router.post("/responder", autentic.validar_Aluno, upload.single("resposta"), atividade_C.responder_atividade);
router.post("/excluir", atividade_C.excluir_atividade);
router.get("/ver_mais_P/:id", autentic.validar_Professor, upload.single("resposta"), atividade_C.listar_ver_mais_P);
router.get("/download/:id_nota", autentic.validar_Professor, atividade_C.baixar_resposta);
router.post("/corrigir", autentic.validar_Professor, atividade_C.corrigir_atividade);
router.get("/editar/:id", atividade_C.listar_editar);
router.post("/editar", atividade_C.editar_atividade);

module.exports = router;