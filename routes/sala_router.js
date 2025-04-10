

const express = require("express");
const Sala_Controller = require("../controllers/sala_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let sala_C = new Sala_Controller();
router.get("/", autentic.validar_Admin, sala_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, sala_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Admin, sala_C.cadastrar_sala);
router.post("/excluir", autentic.validar_Admin, sala_C.excluir_ano_letivo);
router.get("/editar/:id", autentic.validar_Admin, sala_C.listar_editar);
router.post("/editar", autentic.validar_Admin, sala_C.editar_sala);

module.exports = router;