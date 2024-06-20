const express = require('express');
const router = express.Router();

const EtiquetasController = require('../controllers/EtiquetasController');

router.post('/etq-quali-print', EtiquetasController.coqLabelsPrintQuali); 
router.post('/etq-rastreio-print', EtiquetasController.coqLabelsPrintRastreabilidade); 
router.post('/etq-cura-print', EtiquetasController.coqLabelsPrintCura); 
router.post('/etq-cura2-print', EtiquetasController.coqLabelsPrintCura2); 
router.post('/etq-data-print', EtiquetasController.coqLabelsPrintData); 
router.post('/etq-texto-print', EtiquetasController.coqLabelsPrintTexto); 
router.post('/etq-roto-print-search', EtiquetasController.coqLabelsPrintRotoSearch); 
router.post('/etq-roto-print', EtiquetasController.coqLabelsPrintRoto); 
router.post('/etq-barcode39-print', EtiquetasController.coqLabelsPrintBarCode39); 
router.post('/etq-moldagem-print-search', EtiquetasController.coqLabelsPrintMoldagemSearch); 
router.post('/etq-moldagem-print', EtiquetasController.coqLabelsPrintMoldagem); 
router.post('/etq-volkswagen-print-search', EtiquetasController.coqLabelsPrintVolkswagenSearch); 
router.post('/etq-volkswagen-print', EtiquetasController.coqLabelsPrintVolkswagen);
router.post('/etq-ip-print', EtiquetasController.coqLabelsPrintIP); 

module.exports = router;