const express = require('express');
const router = express.Router();

const LabelsController = require('../controllers/LabelsController');

router.post('/etq-quali-print', LabelsController.coqLabelsPrintQuali); 
router.post('/etq-cura-print', LabelsController.coqLabelsPrintCura); 
router.post('/etq-data-print', LabelsController.coqLabelsPrintData); 
router.post('/etq-texto-print', LabelsController.coqLabelsPrintTexto); 
router.post('/etq-roto-print-search', LabelsController.coqLabelsPrintRotoSearch); 
router.post('/etq-roto-print', LabelsController.coqLabelsPrintRoto); 
router.post('/etq-barcode39-print', LabelsController.coqLabelsPrintBarCode39); 
router.post('/etq-moldagem-print-search', LabelsController.coqLabelsPrintMoldagemSearch); 
router.post('/etq-moldagem-print', LabelsController.coqLabelsPrintMoldagem); 
router.post('/etq-volkswagen-print-search', LabelsController.coqLabelsPrintVolkswagenSearch); 
router.post('/etq-volkswagen-print', LabelsController.coqLabelsPrintVolkswagen);
router.post('/etq-ip-print', LabelsController.coqLabelsPrintIP); 

module.exports = router;