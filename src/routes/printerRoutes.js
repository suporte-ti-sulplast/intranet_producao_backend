const express = require('express');
const router = express.Router();

const PrinterController = require('../controllers/PrinterController');

router.get('/print-list', PrinterController.printerList); 
router.post('/print-create', PrinterController.printerCreate); 
router.post('/print-edit', PrinterController.printerEdit); 
router.post('/print-search', PrinterController.printerSearch); 
router.post('/print-alterStatus', PrinterController.printerAlterStatus);
router.post('/print-delete', PrinterController.printerDelete);
router.post('/print-nameIP', PrinterController.printerNameIP);
router.post('/print-edit-save', PrinterController.printerEditSave);

module.exports = router;