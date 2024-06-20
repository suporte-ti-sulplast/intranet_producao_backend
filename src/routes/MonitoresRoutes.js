const express = require('express');
const router = express.Router();

const MonitoresController = require('../controllers/MonitoresController');

router.get('/monitor-racksalati', MonitoresController.rackSalaTI); 
router.post('/monitor-getParameters', MonitoresController.getParameters); 
router.post('/monitor-saveMonitorsParameters', MonitoresController.saveMonitorsParameters); 

module.exports = router;