

const express = require("express");
const Ano_letivo_Controller = require("../controllers/ano_letivo_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let ano_letivo_C = new Ano_letivo_Controller();
router.get("/", autentic.validar_Admin, ano_letivo_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, ano_letivo_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Admin, ano_letivo_C.cadastrar_ano_letivo);
router.post("/excluir", autentic.validar_Admin, ano_letivo_C.excluir_ano_letivo);
router.get("/editar/:id", autentic.validar_Admin, ano_letivo_C.listar_editar);
router.post("/editar", autentic.validar_Admin, ano_letivo_C.editar_ano_letivo);

module.exports = router;