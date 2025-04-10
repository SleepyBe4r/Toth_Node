

const express = require("express");
const Serie_Controller = require("../controllers/serie_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let serie_C = new Serie_Controller();
router.get("/", autentic.validar_Admin, serie_C.listar_view);
router.get("/cadastrar", autentic.validar_Admin, serie_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Admin, serie_C.cadastrar_serie);
router.post("/excluir", autentic.validar_Admin, serie_C.excluir_serie);
router.get("/editar/:id", autentic.validar_Admin, serie_C.listar_editar);
router.post("/editar", autentic.validar_Admin, serie_C.editar_serie);

module.exports = router;