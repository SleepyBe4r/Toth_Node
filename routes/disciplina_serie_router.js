

const express = require("express");
const Disciplina_Serie_Controller = require("../controllers/disciplina_serie_controller");
const Autenticacao = require("../middlewares/autenticacao");
let autentic = new Autenticacao();

const router = express.Router();

let disciplina_C = new Disciplina_Serie_Controller();
router.post("/obter_por_serie/:id", autentic.validar_Admin, disciplina_C.obter_por_serie);

module.exports = router;