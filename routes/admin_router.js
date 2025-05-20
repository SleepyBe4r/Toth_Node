
const express = require("express");
const Admin_Controller = require("../controllers/admin_controller");
const Professor_Controller = require("../controllers/professor_controller");
const Autenticacao = require("../middlewares/autenticacao");

const router = express.Router();

let autentic = new Autenticacao();
let admin_C = new Admin_Controller();
let professor_C = new Professor_Controller();

// Rotas de administração geral
router.get("/home", autentic.validar_Admin, admin_C.home_view);

// Rotas de gerenciamento de professores
router.get("/professores", autentic.validar_Admin, professor_C.listar_view_admin);
router.get("/professores/cadastrar", autentic.validar_Admin, professor_C.listar_cadastroProf_admin);
router.post("/professores/cadastrar", autentic.validar_Admin, professor_C.cadastrar_Prof);
router.post("/professores/excluir", autentic.validar_Admin, professor_C.excluir_Prof);
router.get("/professores/editar/:cpf", autentic.validar_Admin, professor_C.listar_editar_admin);
router.post("/professores/editar", autentic.validar_Admin, professor_C.editar_Prof);

module.exports = router;