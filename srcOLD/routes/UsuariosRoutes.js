const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/UsuariosController');

router.get('/deppto-status', UsuariosController.depptoStattus);
router.get('/deppto', UsuariosController.deppto);
router.post('/user-logged', UsuariosController.userLogged);
router.post('/login-email', UsuariosController.loginEmail);

router.get('/user-list', UsuariosController.userList);
router.post('/user-edit', UsuariosController.userEdit);
router.post('/user-create', UsuariosController.userCreate);
router.post('/user-addbd', UsuariosController.userAddBD);
router.post('/user-updatebd', UsuariosController.userUpdateBD);
router.post('/user-newpassword', UsuariosController.userAlterPassword);
router.post('/user-validpassword', UsuariosController.userValidPassword);
router.post('/user-search', UsuariosController.pesquisaUsers);
router.post('/user-delete', UsuariosController.userDelete);
router.post('/user-pwdAgeforce', UsuariosController.pwdAgeforce);
router.get('/user-userActivyDirectory', UsuariosController.userActivyDirectory);
router.post('/emailsGroup-create', UsuariosController.emailsGroupCreate);
router.post('/emailsGroup-find', UsuariosController.grupoEmailFind);
router.get('/emailsGroup-list', UsuariosController.grupoEmailList);
router.post('/emailsGroup-delete', UsuariosController.grupoEmailDelete);
router.post('/emailsGroup-edit', UsuariosController.emailsGroupEdit);
router.post('/emailsGroup-findUsers', UsuariosController.emailsGroupFindUsers);
router.post('/emailsGroup-deleteUsers', UsuariosController.grupoEmailDeleteUsers);
router.post('/emailsGroup-addUsers', UsuariosController.grupoEmailAdd);



module.exports = router;