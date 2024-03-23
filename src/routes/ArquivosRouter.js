const express = require('express');
const router = express.Router();

const ArquivosController = require('../controllers/ArquivosController');

router.get('/api/arquivos-lgpd', ArquivosController.listarArquivosLGPD); 
router.post('/api/arquivos-its', ArquivosController.listarArquivosITs); 
router.get('/api/arquivos-comunicacoes', ArquivosController.listarArquivosComunicações); 
router.get('/api/arquivos-manuais-informatica', ArquivosController.listarArquivosManuaisInformatica); 
router.get('/arquivos-lista-ramais', ArquivosController.listarArquivosRamais); 

module.exports = router;