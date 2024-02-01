const express = require('express');
const router = express.Router();

const ConciergeController = require('../controllers/ConciergeController');

router.get('/port-list-vehicles', ConciergeController.listaVeiculos); 
router.post('/port-list-moviment-vehicles', ConciergeController.movimentoVeiculos); 
router.post('/port-save-moviment-vehicles', ConciergeController.salvaMovimentoVeiculos); 

module.exports = router;