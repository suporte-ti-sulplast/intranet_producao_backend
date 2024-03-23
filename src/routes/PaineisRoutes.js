const express = require('express');
const router = express.Router();

const PaneisController = require('../controllers/PaneisController');

router.post('/painel/onde-estou', PaneisController.panelSearch);
router.post('/painel/onde-estou-save', PaneisController.panelSave);
router.post('/painel/onde-estou-data', PaneisController.panelData);

module.exports = router;