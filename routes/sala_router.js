

const express = require("express");
const Sala_Controller = require("../controllers/sala_controller");

const router = express.Router();

let sala_C = new Sala_Controller();
router.get("/", sala_C.listar_view);
router.get("/cadastrar", sala_C.cadastrar_sala)

module.exports = router;