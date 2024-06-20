const express = require('express');
const router = express.Router();

const CoqController = require('../controllers/CoqController');

router.post('/sgi-it-create', CoqController.sgiItCreate);
router.post('/sgi-it-search', CoqController.sgiItSearch);
router.get('/sgi-it-all', CoqController.sgiItList);
router.post('/sgi-it-delete', CoqController.sgiItsDelete);
router.post('/sgi-it-update', CoqController.sgiItUpdate);

module.exports = router;