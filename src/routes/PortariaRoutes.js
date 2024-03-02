const express = require('express');
const router = express.Router();

const PortariaController = require('../controllers/PortariaController');

router.get('/port-list-vehicles', PortariaController.listaVeiculos); 
router.post('/port-list-moviment-vehicles', PortariaController.movimentoVeiculos); 
router.post('/port-save-moviment-vehicles', PortariaController.salvaMovimentoVeiculos); 

module.exports = router;