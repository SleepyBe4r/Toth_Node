

const express = require("express");
const Admin_Controller = require("../controllers/admin_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let admin_C = new Admin_Controller();
router.get("/", autentic.validar_Admin, admin_C.listar_home);

module.exports = router;