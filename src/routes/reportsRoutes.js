const express = require('express');
const router = express.Router();

const ReportsController = require('../controllers/ReportsController');

router.post('/consultaFechamentoEstoque', ReportsController.consultaFechamentoEstoque); //CONSULTA DELSOFT TESTE

module.exports = router;