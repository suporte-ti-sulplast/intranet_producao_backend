const express = require('express');
const router = express.Router();

const PanelController = require('../controllers/PanelController');

router.post('/painel/onde-estou', PanelController.panelSearch);
router.post('/painel/onde-estou-save', PanelController.panelSave);
router.post('/painel/onde-estou-data', PanelController.panelData);

module.exports = router;