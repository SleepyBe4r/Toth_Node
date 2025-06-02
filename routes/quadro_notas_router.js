

const express = require("express");
const Autenticacao = require("../middlewares/autenticacao");
const Quadro_Notas_Controller = require("../controllers/quadro_notas_controller");
let autentic = new Autenticacao();

const router = express.Router();

let quadro_notas_C = new Quadro_Notas_Controller();
router.get("/", autentic.validar_Professor, quadro_notas_C.listar_view);
router.get("/cadastrar", autentic.validar_Professor, quadro_notas_C.listar_cadastro);
router.post("/cadastrar", autentic.validar_Professor, quadro_notas_C.cadastrar_quadro_notas);
router.post("/excluir", autentic.validar_Professor, quadro_notas_C.excluir_quadro_notas);
router.get("/editar/:id", autentic.validar_Professor, quadro_notas_C.listar_editar);
router.post("/editar", autentic.validar_Professor, quadro_notas_C.editar_quadro_notas);
router.get("/filtrar", autentic.validar_Professor, quadro_notas_C.filtrar);

module.exports = router;