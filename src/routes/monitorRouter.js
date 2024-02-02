const express = require('express');
const router = express.Router();

const MonitorsController = require('../controllers/MonitorsController');

router.get('/monitor-racksalati', MonitorsController.rackSalaTI); 
router.post('/monitor-getParameters', MonitorsController.getParameters); 
router.post('/monitor-saveMonitorsParameters', MonitorsController.saveMonitorsParameters); 

module.exports = router;