const { Op, literal } = require('sequelize');
const moment = require('moment');
const AccessLevelModel = require('../../models/AccessLevels');
const DepartmentsModel = require('../../models/Departments');
const StatusesModel = require('../../models/Statuses');
const UsersModel = require('../../models/Users');
const AccessAplicationsModel = require('../../models/AccessAplications');
const AplicationsModel = require('../../models/Applications');
const SettingsModel = require('../../models/Settings');
const calcularDiferencaEmDias = require('../functions/paswordAge');
const { sendEmailPassword } = require('../functions/sendEmail');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config()

//PESQUISA FILTRO DO USUÁRIO  ************************************************************************************************************
exports.pesquisaUsers = async (req, res) => {

  // Use as datas de início e fim conforme fornecidas no corpo da solicitação
  const dataInicial = req.body.filter.dtInicio === "" ? moment("1900-01-01", 'YYYY-MM-DD') : moment(req.body.filter.dtInicio, 'YYYY-MM-DD');
  const dataFinal = req.body.filter.dtFim === "" ? moment("3000-01-01", 'YYYY-MM-DD') : moment(req.body.filter.dtFim, 'YYYY-MM-DD');

  const bool = (e) => {
    if (e === "Todos") return "";
    if (e === "Não") return 0;
    if (e === "Sim") return 1;
  }

  const { login, name, email, coq} = req.body.filter;
  const sendEmail = bool(req.body.filter.sendEmail);
  const shared = bool(req.body.filter.shared);
  var depto, level, stts;
  const whereClauseDept = {};
  const whereClauseStts = {};
  const whereClauseLvvl = {};

  if(req.body.filter.depto === "Todos") {
    depto = null;
  } else {
    const dpto = await DepartmentsModel.findOne({
      attributes: ['idDept', 'department'],
      where: {department :req.body.filter.depto }
    });
    depto = dpto.idDept;
    whereClauseDept.idDept = depto;
  };

  if(req.body.filter.stts === "Todos") {
    stts = null;
  } else {
    const sts = await StatusesModel.findOne({
      attributes: ['idStatus', 'status'],
      where: {status :req.body.filter.stts }
    });
    stts = sts.idStatus;
    whereClauseStts.idStatus = stts;
  };

  if(req.body.filter.level === "Todos") {
    level = null;
  } else {
    const lvl = await AccessLevelModel.findOne({
      attributes: ['idLevel', 'accessLevel'],
      where: {accessLevel :req.body.filter.level }
    });
    level = lvl.idLevel;
    whereClauseLvvl.idLevel = level;
  };

  try {
    const users = await UsersModel.findAll({
      where: {
        login: {
          [Op.like]: `%${login}%`
        },
        nameComplete: {
          [Op.like]: `%${name}%`
        },
        email: {
          [Op.like]: `%${email}%`
        },
        codCQ: {
          [Op.like]: `%${coq}%`
        },
        sendEmail: {
          [Op.like]: `%${sendEmail}%`
        },
        sharedUser: {
          [Op.like]: `%${shared}%`
        },
        createdAt: {
          [Op.between]: [
            literal(`DATE("${dataInicial.format('YYYY-MM-DD')}")`), // Trunca a data de início
            literal(`DATE("${dataFinal.format('YYYY-MM-DD')}") + INTERVAL 1 DAY`) // Adiciona 1 dia para incluir o dia final
          ]
        },
      },
        attributes: ['idUser', 'login', 'email', 'nameComplete', 'sharedUser', 'idStatus', 'codCQ', 'sendEmail', 'agePassword', 'createdAt'],
        include: [{ 
          model: DepartmentsModel,
          attributes: ['department', 'idDept'],
          where: whereClauseDept,
          include: [{
              model: AccessLevelModel,
              attributes: ['idlevel','accessLevel'],
              where: whereClauseLvvl,
          }]
        },
        {
          model: StatusesModel,
          attributes: ['status', 'idStatus'],
          where: whereClauseStts,
        }      
      ],
        raw: true,
        nest: true,
        order: [['login', 'ASC']]
    });

      return res.json({ users });

  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }
};



//RETORNA O USUÁRIO LOGADO ************************************************************************************************************
exports.userLogged = async (req, res) => {

  console.log(req.body)

  const user = req.body.user; 
  const logged = await UsersModel.findOne({
    where: { login: user },
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'sharedUser', 'agePassword','forcedChangePassword', 'codCQ'],
      include: [
        { 
          model: DepartmentsModel,
          attributes: ['department', 'idDept', 'idlevel'],
          include: [
            {
              model: AccessLevelModel,
              attributes: ['accessLevel', 'idLevel'],
              order: ['department', 'ASC']  
            },           
          ]
        },
        {
          model: StatusesModel,
          attributes: ['status', 'idStatus'],
        }
    ],
    raw : true,
    nest : true
  });

  //BUSCA AS CONFIGURAÇÕES
  const settings = await SettingsModel.findAll({
    attributes: ['descriptionSet', 'valueSet'],
  });

  //CALCULA A IDADE DA SENHA
  const maxAgePassword = settings[0].valueSet
  const dataAge = (maxAgePassword - calcularDiferencaEmDias(logged.agePassword));
  const idDept = logged.Department.idDept;

  const acessAplications = await AccessAplicationsModel.findAll({
    where: { idDept: idDept },
    attributes: ['idApplications', 'idDept'],
    include: [{ 
      model: AplicationsModel,
      attributes: ['applications', 'image'],
      where: {idStatus: 1},
    }], 
    raw : true ,
    nest : true
  });

  applicationsList = acessAplications.map(item => item.Application.applications);

  return res.json({ logged,  applicationsList, dataAge, settings });
};



//LISTAGEM DOS USUÁRIOS *********************************************************************************************************************************
exports.userList = async (req, res) => {

  try {
      const users = await UsersModel.findAll({
          attributes: ['idUser', 'login', 'email', 'nameComplete', 'sharedUser', 'idStatus', 'sendEmail', 'agePassword', 'createdAt', 'codCQ', 'birthdate'],
          include: [{ 
            model: DepartmentsModel,
            attributes: ['department', 'idDept'],
            include: [{
                model: AccessLevelModel,
                attributes: ['idlevel','accessLevel'],
            }]
          },
          {
            model: StatusesModel,
            attributes: ['status', 'idStatus'],
          }      
        ],
          raw: true,
          nest: true,
          order: [['login', 'ASC']]
      });

      return res.json({ users });
  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }
};


//FORM DE EDIÇÃO DOS USUÁRIOS
exports.userEdit = async (req, res) => {

  const userId = parseInt(req.body.userId);
  const user = await UsersModel.findOne({
    where: { idUser: userId },
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'idDept', 'sharedUser','sendEmail', 'idStatus' , 'codCQ', 'birthdate'],
      include: [
        { 
          model: DepartmentsModel,
          attributes: ['department', 'idDept', 'idlevel'],
              include: [{
                  model: AccessLevelModel,
                  attributes: ['idlevel','accessLevel'],
              }]
        },
        {
          model: StatusesModel,
          attributes: ['status', 'idStatus'],
        }
      ],
        raw : true,
        nest : true
  });

  const deptto = await DepartmentsModel.findAll({
    attributes: ['department', 'idlevel'],
        include: [{
            model: AccessLevelModel,
            attributes: ['idlevel','accessLevel'],
        }],
    raw : true,
    nest : true
  });

  const stattus = await StatusesModel.findAll({
    attributes: ['status', 'idStatus'],
    raw : true,
    nest : true
  });

  return res.json({ user, deptto, stattus });
};

//FORM PARA CRIAÇÃO DE NOVO USUÁRIO
exports.userCreate = async (req, res) => {

  const userId = parseInt(req.body.userId)

  const user = await UsersModel.findOne({
    where: { idUser: userId },
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'sharedUser', 'idStatus', 'sendEmail'],
      include: [{ 
        model: DepartmentsModel,
        attributes: ['department', 'idlevel'],
            include: [{
                model: AccessLevelModel,
                attributes: ['idlevel','accessLevel'],
            }]
    }],
    raw : true,
    nest : true
  });

  const deptto = await DepartmentsModel.findAll({
    attributes: ['department', 'idlevel'],
        include: [{
            model: AccessLevelModel,
            attributes: ['idlevel','accessLevel'],
        }],
    raw : true,
    nest : true
  })

  return res.json({ user: user, deptto: deptto });
};

//BUSCA O DEPARTAMENTO E STATUS DO USER
exports.depptoStattus = async (req, res) => {

  const deptto = await DepartmentsModel.findAll({
    attributes: ['idDept', 'department', 'idlevel'],
        include: [{
            model: AccessLevelModel,
            attributes: ['idlevel','accessLevel'],
        }],
    raw : true,
    nest : true,
    order: [['department', 'ASC']]
  });

  const stattus = await StatusesModel.findAll({
    attributes: ['idStatus', 'status'],
    raw : true,
    nest : true
 });

 const level = await AccessLevelModel.findAll({
  attributes: ['idLevel', 'accessLevel'],
  raw : true,
  nest : true
});

  return res.json({ deptto, stattus, level });

};

//VERIFICA SE EXITE LOGIN E EMAIL E COQ
exports.loginEmail = async (req, res) => {

  const {login, email, codCQ } = req.body;
  var CQ;

  console.log(login, email, codCQ)

  if(codCQ === null || codCQ === "") {
    CQ = 'AA'
  } else {
    if (codCQ.includes('CQ')) {
      const indexCQ = codCQ.indexOf('CQ');
      CQ = 'CQ' + codCQ.slice(indexCQ + 2, indexCQ + 4);
        console.log(CQ);
    }
  }
  
  var haveLogin, haveEmail, haveCodCQ;
  haveLogin = haveEmail = haveCodCQ = false;

  const findLogin = await UsersModel.findOne({
    where: {login: login}, 
    attributes: ['login'],
    raw : true,
    nest : true
  })

  const findEmail = await UsersModel.findOne({
    where: {email: email},
    attributes: ['email'],
    raw : true,
    nest : true
  })

  const findCQ = await UsersModel.findOne({
    where: {
      codCQ: {
        [Sequelize.Op.like]: `%${CQ}%`
      }
    },
    attributes: ['codCQ'],
    raw : true,
    nest : true
  })

  if(findLogin) haveLogin = findLogin.login
  if(findEmail) haveEmail = findEmail.email
  if(findCQ) haveCodCQ = findCQ.codCQ

  console.log(haveCodCQ)

  return res.json({ haveLogin, haveEmail, haveCodCQ });
};


//INSERÇÃO DE NOVO USUÁRIO NO BD
exports.userAddBD = async (req, res) => {

  const dataAtual = new Date();

  //CRIPTOGRAFA A SENHA PARA GUARDAR NO BANCO
  var password = await bcrypt.hash(req.body.senha, 10);
  var msg, msg_type;

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const novoUsuario  = {
      login: req.body.login,
      nameComplete: req.body.name,
      email: req.body.email,
      idDept: req.body.setorId,
      idStatus: req.body.statusId,
      sendEmail: parseInt(req.body.recebeEmail),
      sharedUser: parseInt(req.body.compart),
      password: password,
      agePassword: dataAtual,
      forcedChangePassword: 0,
      codCQ: req.body.codCQ,
      birthdate: req.body.birthdate
  };

  //ATUALIZA A TABELA COM O NOVO VALOR
  await UsersModel.create(novoUsuario).then(() => {
      console.log("Usuário criado com sucesso");
      msg = "Usuário criado com sucesso"
      msg_type = "success"
  }).catch((err) => {
      console.log("erro", err);
      msg = "Houve um erro interno."
      msg_type = "error"
  }) ;

  return res.json({ msg, msg_type });
};

//ALTERAÇÃO DE USUÁRIO NO BD
exports.userUpdateBD = async (req, res) => {

  var msg, msg_type;
  const userId = parseInt(req.body.userId);

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const alteraUsuario  = {
      nameComplete: req.body.textName,
      email: req.body.textEmail,
      idDept: req.body.setorId,
      idStatus: req.body.statusId,
      sendEmail: parseInt(req.body.recebeEmail),
      sharedUser: req.body.shared,
      codCQ: req.body.codCQ,
      birthdate: req.body.birthdate
  };

  // ATUALIZA A TABELA COM O NOVO VALOR
  await UsersModel.update(alteraUsuario, {
    where: {
      idUser: userId
    }
  }).then(() => {
    console.log("Usuário atualizado com sucesso");
    msg = "Usuário atualizado com sucesso";
    msg_type = "success";
  }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
  });

  return res.json({ msg, msg_type });
};


//ALTERAÇÃO DE SENHA DO USUÁRIO
exports.userAlterPassword = async (req, res) => {

  const dataAtual = new Date();

  var id = parseInt(req.body.id);
  var trocaSenha = (req.body.forceChange)
  var idLoggeg = parseInt(req.body.idLoggeg);

  //CRIPTOGRAFA A SENHA PARA GUARDAR NO BANCO
  var password = await bcrypt.hash(req.body.newPasword, 10);
  var msg, msg_type;

  //buscas as ultimas senhas
  const senhas = await UsersModel.findOne({
    where: { idUser: id },
      attributes: ['idUser','nameComplete', 'email', 'sendEmail', 'password', 'passwordOld1', 'passwordOld2', 'agePassword', 'forcedChangePassword' ],
        raw : true,
        nest : true
      });

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const novaSenha  = {
      password: password, //salva a senha nova no slot de senha
      passwordOld1: senhas.password, //salva a senha antiga no slot de senha 1
      passwordOld2: senhas.passwordOld1, // salva a senha 1 no slot de senha 2
      agePassword: dataAtual,
      forcedChangePassword: trocaSenha
  };

  // ATUALIZA A TABELA COM O NOVO VALOR
  await UsersModel.update(novaSenha, {
    where: {
      idUser: id
    }
  }).then(() => {
    msg = "Senha alterada com sucesso";
    msg_type = "success";
    console.log(req.body.id);
    console.log(req.body.newPasword);
  }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
  });

  if(senhas.sendEmail === 1 && id !== idLoggeg) {
    const envioEmail = sendEmailPassword(senhas.nameComplete, senhas.email, req.body.newPasword);
    console.log(envioEmail);
  }
  
  return res.json({ msg, msg_type });
};

//EXCLUSÃO DO USUÁRIO
exports.userDelete = async (req, res) => {

  var id = parseInt(req.body.id)
  var msg, msg_type;

  // ATUALIZA A TABELA COM O NOVO VALOR
  await UsersModel.destroy({
    where: {
      idUser: id
    }
  }).then(() => {
    msg = "Usuário excluído com sucesso";
    msg_type = "success";
  }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
  });

  return res.json({ msg, msg_type });
};

//VALIDA AS ULTIMAS 3 SENHAS
exports.userValidPassword = async (req, res) => {

  var id = parseInt(req.body.id);
  var password = req.body.newPasword;
  var validated = false;
  var compar1, compar2, compar3; 

  const senhas = await UsersModel.findOne({
    where: { idUser: id },
      attributes: ['idUser','password', 'passwordOld1', 'passwordOld2' ],
        raw : true,
        nest : true
      });

      //compara se a nova senha é igual a uma das ultimas 3 senhas.
      try {
        compar1 = bcrypt.compareSync(password, senhas.password);
      } catch (error) {
        compar1 = false;
      }
      try {
        compar2 = bcrypt.compareSync(password, senhas.passwordOld1);
      } catch (error) {
        compar2 = false;
      }
      try {
        compar3 = bcrypt.compareSync(password, senhas.passwordOld2);
      } catch (error) {
        compar3 = false;
      }

      //caso uma das comparações seja verdadeira não permite a alteração ... retorna um FALSE
      if(compar1 || compar2 || compar3) {
      } else {
        //caso todas das comparações sejas falsas permite a alteração ... retorna um TRUE
        validated = true; //
      }

  return res.json({ validated });
};

//verifica idade e troca de senha
exports.pwdAgeforce = async (req, res) => {

  var id = parseInt(req.body.id)

  const resposta = await UsersModel.findOne({
    where: { idUser: id },
      attributes: ['agePassword', 'forcedChangePassword' ],
        raw : true,
        nest : true
      });

  return res.json({resposta});
};




