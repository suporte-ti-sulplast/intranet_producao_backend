const express = require('express');
const router = express.Router();

const RecepcaoController = require('../controllers/RecepcaoController');

router.post('/recepcao-getVoucherWifi', RecepcaoController.getVoucherWifi); 
router.post('/recepcao-saveUsedVoucher', RecepcaoController.saveUsedVoucher); 
router.post('/recepcao-findRamal', RecepcaoController.findRamal); 
router.post('/recepcao-createEditRamal', RecepcaoController.createEditRamal); 
router.post('/recepcao-deleteRamal', RecepcaoController.deleteRamal); 

module.exports = router;