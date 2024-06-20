const express = require('express');
const router = express.Router();

const PcpController = require('../controllers/PcpController');

router.get('/pcp-getProducaoExtrusora', PcpController.getProducaoExtrusora); 
router.post('/pcp-editProducaoExtrusora', PcpController.editProducaoExtrusora); 
router.post('/pcp-addProducaoExtrusora', PcpController.addProducaoExtrusora); 

module.exports = router;