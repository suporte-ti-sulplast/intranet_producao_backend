const express = require('express');
const router = express.Router();

const VouchersController = require('../controllers/VouchersController');

router.post('/getVoucherWifi', VouchersController.getVoucherWifi); 

module.exports = router;