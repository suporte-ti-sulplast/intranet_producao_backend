const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/UsersController');

router.get('/deppto-status', UsersController.depptoStattus);
router.post('/user-logged', UsersController.userLogged);
router.post('/login-email', UsersController.loginEmail);

router.get('/user-list', UsersController.userList);
router.post('/user-edit', UsersController.userEdit);
router.post('/user-create', UsersController.userCreate);
router.post('/user-addbd', UsersController.userAddBD);
router.post('/user-updatebd', UsersController.userUpdateBD);
router.post('/user-newpassword', UsersController.userAlterPassword);
router.post('/user-validpassword', UsersController.userValidPassword);
router.post('/user-search', UsersController.pesquisaUsers);
router.post('/user-delete', UsersController.userDelete);
router.post('/user-pwdAgeforce', UsersController.pwdAgeforce);

module.exports = router;