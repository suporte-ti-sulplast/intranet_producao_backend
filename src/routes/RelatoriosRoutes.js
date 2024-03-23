const express = require('express');
const router = express.Router();

const RelatoriosController = require('../controllers/RelatoriosController');

router.post('/consultaFechamentoEstoque', RelatoriosController.consultaFechamentoEstoque); //CONSULTA DELSOFT TESTE

module.exports = router;