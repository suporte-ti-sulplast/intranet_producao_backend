const express = require('express');
const router = express.Router();

const SgisController = require('../controllers/SgisController');

router.post('/sgi-it-create', SgisController.sgiItCreate);
router.post('/sgi-it-search', SgisController.sgiItSearch);
router.get('/sgi-it-all', SgisController.sgiItList);
router.post('/sgi-it-delete', SgisController.sgiItsDelete);
router.post('/sgi-it-update', SgisController.sgiItUpdate);

module.exports = router;