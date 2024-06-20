const express = require('express');
const router = express.Router();

const SenhasCofreController = require('../controllers/SenhasCofreController');

router.post('/senha-list', SenhasCofreController.senhasList); 
router.get('/senha-category', SenhasCofreController.senhaCategory); 
router.post('/senha-delete', SenhasCofreController.senhaDelete);
router.post('/senha-categoria-delete', SenhasCofreController.senhaCategoriaDelete);
router.post('/senha-categoria-find', SenhasCofreController.senhaCategoriaFind);
router.post('/senha-categoria-edit-add', SenhasCofreController.senhaCategoriaEditAdd);
router.post('/senha-addEdit', SenhasCofreController.senhaEditAdd);
router.post('/senha-find', SenhasCofreController.senhaFind);
router.post('/senha-enviarPDFEmail', SenhasCofreController.senhaEnviarPDFEmail);


module.exports = router;