const express = require('express');
const router = express.Router();

const TelasController = require('../controllers/TelasController');

router.get('/telas-findViews', TelasController.findViews); 

router.post('/telas-findUserPermission', TelasController.findUserPermission); 
router.post('/telas-saveUserPermission', TelasController.saveUserPermission); 
router.post('/telas-findDepartmentPermission', TelasController.findDepartmentPermission); 
router.post('/telas-saveDepartmentPermission', TelasController.saveDepartmentPermission); 

module.exports = router;