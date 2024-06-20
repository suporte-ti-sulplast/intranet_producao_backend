const express = require('express');
const router = express.Router();

const EtiquetasController = require('../controllers/EtiquetasController');

router.post('/etq-quali-print', EtiquetasController.coqLabelsPrintQuali); 
router.post('/etq-rastreio-print', EtiquetasController.coqLabelsPrintRastreabilidade); 
router.post('/etq-cura-print', EtiquetasController.coqLabelsPrintCura); 
router.post('/etq-cura-estufa-print', EtiquetasController.coqLabelsPrintCuraEstufa); 
router.post('/etq-data-print', EtiquetasController.coqLabelsPrintData); 
router.post('/etq-texto100x23-print', EtiquetasController.coqLabelsPrintTexto100x23); 
router.post('/etq-texto100x100-print', EtiquetasController.coqLabelsPrintTexto100x100); 
router.post('/etq-texto100x200-print', EtiquetasController.coqLabelsPrintTexto100x200); 
router.post('/etq-roto-print-search', EtiquetasController.coqLabelsPrintRotoSearch); 
router.post('/etq-roto-print', EtiquetasController.coqLabelsPrintRoto); 
router.post('/etq-barcode39-print', EtiquetasController.coqLabelsPrintBarCode39); 
router.post('/etq-moldagem-print-search', EtiquetasController.coqLabelsPrintMoldagemSearch); 
router.post('/etq-moldagem-print', EtiquetasController.coqLabelsPrintMoldagem); 
router.post('/etq-volkswagen-print-search', EtiquetasController.coqLabelsPrintVolkswagenSearch); 
router.post('/etq-volkswagen-print', EtiquetasController.coqLabelsPrintVolkswagen);
router.post('/etq-texto20x20-print', EtiquetasController.coqLabelsPrintTexto20x20); 
router.post('/etq-graos-print-search', EtiquetasController.coqLabelsPrintGraosSearch); 
router.post('/etq-graos-print', EtiquetasController.coqLabelsPrintGraos);

module.exports = router;