const express = require('express');
const router = express.Router();

const DepartamentosController = require('../controllers/DepartamentosController');

router.get('/departments-list', DepartamentosController.departmentsList); 
router.post('/departments-find', DepartamentosController.departmentsFind); 
router.post('/departments-create', DepartamentosController.departmentsCreate); 
router.post('/departments-edit', DepartamentosController.departmentsEdit); 

/*router.post('/departments-alterStatus', DepartamentosController.departmentsAlterStatus);*/
router.post('/departments-delete', DepartamentosController.departmentsDelete); 

module.exports = router;