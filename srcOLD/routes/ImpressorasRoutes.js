const express = require('express');
const router = express.Router();

const ImpressorasController = require('../controllers/ImpressorasController');

router.get('/print-list', ImpressorasController.printerList); 
router.post('/print-create', ImpressorasController.printerCreate); 
router.post('/print-edit', ImpressorasController.printerEdit); 
router.post('/print-search', ImpressorasController.printerSearch); 
router.post('/print-alterStatus', ImpressorasController.printerAlterStatus);
router.post('/print-delete', ImpressorasController.printerDelete);
router.post('/print-nameIP', ImpressorasController.printerNameIP);
router.post('/print-edit-save', ImpressorasController.printerEditSave);

module.exports = router;