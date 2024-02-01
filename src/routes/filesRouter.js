const express = require('express');
const router = express.Router();

const FilesController = require('../controllers/FilesController');

router.get('/api/arquivos-lgpd', FilesController.listarArquivosLGPD); 
router.post('/api/arquivos-its', FilesController.listarArquivosITs); 
router.get('/api/arquivos-comunicacoes', FilesController.listarArquivosComunicações); 
router.get('/api/arquivos-manuais-informatica', FilesController.listarArquivosManuaisInformatica); 
router.get('/arquivos-lista-ramais', FilesController.listarArquivosRamais); 

module.exports = router;