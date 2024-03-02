const express = require('express');
const router = express.Router();

const DelsoftController = require('../controllers/DelsoftController');

router.post('/delsoft-vendas-periodo-cliente', DelsoftController.vendasPeriodoCliente); 
router.get('/delsoft-lista-cliente', DelsoftController.listaClientes); 

module.exports = router;