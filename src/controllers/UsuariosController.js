const { Op, literal } = require('sequelize');
const moment = require('moment');
const AccessLevelModel = require('../../models/NiveisAcessos');
const DepartmentsModel = require('../../models/Departamentos');
const StatusesModel = require('../../models/Status');
const UsersModel = require('../../models/Usuarios');
const AccessAplicationsModel = require('../../models/AplicacoesDepartamentos');
const AplicationsModel = require('../../models/Aplicacoes');
const SettingsModel = require('../../models/Configuracoes');
const calcularDiferencaEmDias = require('../functions/paswordAge');
const { sendEmailPassword } = require('../functions/sendEmail');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config()


// Chave secreta para criptografia (mantenha isso seguro)
const secretKey = process.env.SECRET_KEY;

const decryptIdBadge = (encryptedIdBadge) => {
    if (!encryptedIdBadge) {
      return null; // ou trate conforme necessário para sua aplicação
    }
    const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
    let decryptedIdBadge = decipher.update(encryptedIdBadge, 'hex', 'utf-8');
    decryptedIdBadge += decipher.final('utf-8');
    return decryptedIdBadge;
  };

  const encryptData = (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', secretKey);
    let encryptedData = cipher.update(data, 'utf-8', 'hex') || '';
    encryptedData += cipher.final('hex');
    return encryptedData;
  };


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

  const user = req.body.user; 
  var dataAge;
  
  const logged = await UsersModel.findOne({
    where: { login: user },
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'agePassword','forcedChangePassword', 'codCQ', 'badge'],
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

  // Verifica se o campo idBadge não é nulo
  if (logged.badge !== null && logged.badge !== undefined && logged.badge !== '') {
      try {
          // Descriptografa o idBadge
          logged.badge = decryptIdBadge(logged.badge);
      } catch (error) {
          console.error('Erro ao descriptografar badge:', error);
          // Tratar o erro conforme necessário (por exemplo, atribuir um valor padrão)
      }
  }

  //BUSCA AS CONFIGURAÇÕES
  const settings = await SettingsModel.findAll({
    attributes: ['descriptionSet', 'valueSet'],
  });

  //CALCULA A IDADE DA SENHA
  const maxAgePassword = settings[0].valueSet
  if(logged.badge){
    dataAge = 9999;
  } else {
    dataAge = (maxAgePassword - calcularDiferencaEmDias(logged.agePassword));
  }

  const idDept = logged.Departamento.idDept;

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

  applicationsList = acessAplications.map(item => item.Aplicaco.applications);

  return res.json({ logged,  applicationsList, dataAge, settings });
};



//LISTAGEM DOS USUÁRIOS *********************************************************************************************************************************
exports.userList = async (req, res) => {

  try {
      const respostas = await UsersModel.findAll({
          attributes: ['idUser', 'login', 'email', 'nameComplete', 'idStatus', 'sendEmail', 'agePassword', 'createdAt', 'codCQ', 'badge', 'birthdate'],
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

      // Descriptografa o idBadge para cada usuário no resultado da consulta
      const users = respostas.map(resposta => {
        // Verifica se o campo idBadge não é nulo
        if (resposta.badge !== null && resposta.badge !== undefined && resposta.badge !== "") {
          try {
              // Descriptografa o idBadge
              resposta.badge = decryptIdBadge(resposta.badge);
          } catch (error) {
              console.error('Erro ao descriptografar badge:', error);
              console.log(resposta.badge)
              // Tratar o erro conforme necessário (por exemplo, atribuir um valor padrão)
          }
      }

      return resposta;
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
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'idDept','sendEmail', 'idStatus' , 'codCQ', 'badge', 'birthdate'],
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

  // Verifica se o campo idBadge não é nulo
  if (user.badge !== null && user.badge !== undefined) {
    try {
        // Descriptografa o idBadge
        user.badge = decryptIdBadge(user.badge);
    } catch (error) {
        console.error('Erro ao descriptografar badge:', error);
        // Tratar o erro conforme necessário (por exemplo, atribuir um valor padrão)
    }
}

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
      attributes: ['idUser', 'login', 'email', 'nameComplete', 'idStatus', 'sendEmail'],
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

//VERIFICA SE EXITE LOGIN E EMAIL E COQ e CRACHÁ
exports.loginEmail = async (req, res) => {

  const { login, email, codCQ, cracha } = req.body;
  const newCracha = parseInt(cracha) || 999999;
  
  var CQ;

  if(codCQ === null || codCQ === "") {
    CQ = 'AA'
  } else {
    if (codCQ.includes('CQ')) {
      const indexCQ = codCQ.indexOf('CQ');
      CQ = 'CQ' + codCQ.slice(indexCQ + 2, indexCQ + 4);
        console.log(CQ);
    }
  }
  
  var haveLogin, haveEmail, haveCodCQ, haveCracha;
  haveLogin = haveEmail = haveCodCQ = haveCracha = false;

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


  findCracha = await UsersModel.findOne({
    where: {badge: newCracha},
    attributes: ['badge'],
    raw : true,
    nest : true
  })

  if(findLogin) haveLogin = findLogin.login
  if(findEmail) haveEmail = findEmail.email
  if(findCQ) haveCodCQ = findCQ.codCQ
  if(findCracha) haveCracha = findCracha.idBadge

  return res.json({ haveLogin, haveEmail, haveCodCQ, haveCracha });
};


//INSERÇÃO DE NOVO USUÁRIO NO BD
exports.userAddBD = async (req, res) => {

  const dataAtual = new Date();
  const idBadge = req.body.cracha && req.body.cracha.trim() !== '' ? req.body.cracha : null;

  //CRIPTOGRAFA A SENHA PARA GUARDAR NO BANCO
  var password = await bcrypt.hash(req.body.senha, 10);
  var crachaCrypto = (idBadge !== null && idBadge !== undefined && idBadge !== '') ? encryptData(idBadge) : '';
  var msg, msg_type;

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const novoUsuario  = {
      login: req.body.login,
      nameComplete: req.body.name,
      email: req.body.email,
      idDept: req.body.setorId,
      idStatus: req.body.statusId,
      sendEmail: req.body.recebeEmail,
      password: password,
      agePassword: dataAtual,
      forcedChangePassword: 'N',
      codCQ: req.body.codCQ,
      badge: crachaCrypto,
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

  console.log(req.body.cracha)
  console.log(typeof(req.body.cracha))

  const idBadge = req.body.cracha && req.body.cracha.trim() !== '' ? req.body.cracha : null;
  var crachaCrypto = (idBadge !== null && idBadge !== undefined && idBadge !== '') ? encryptData(idBadge) : '';

  //COLOCA O NOVO VALOR NUMA VARIAVEL
  const alteraUsuario  = {
      nameComplete: req.body.textName,
      email: req.body.textEmail,
      idDept: req.body.setorId,
      idStatus: req.body.statusId,
      sendEmail: req.body.recebeEmail,
      codCQ: req.body.codCQ,
      badge: crachaCrypto,
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
  var trocaSenha = req.body.forceChange ? 'S' : 'N';
  var idLoggeg = parseInt(req.body.idLoggeg);

  console.log(trocaSenha);
  console.log(req.body.newPasword);

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
  }).catch((err) => {
    console.log("erro", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
  });

  if(senhas.sendEmail === 'S' && id !== idLoggeg) {
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

//BUSCA O DEPARTAMENTO E STATUS DO USER
exports.deppto = async (req, res) => {

  const deptto = await DepartmentsModel.findAll({
    attributes: ['idDept', 'department'],
    raw : true,
    nest : true,
    order: [['department', 'ASC']]
  });

  return res.json({ deptto });

};


//LISTAGEM DOS USUÁRIOS *********************************************************************************************************************************
exports.userActivyDirectory = async (req, res) => {

  const inputFilePath = 'public/files/usersAd.json';

  // Lê os dados do arquivo JSON
  const jsonData = fs.readFileSync(inputFilePath, 'utf-8');
  const usersArray = JSON.parse(jsonData);
  
  // Inicializa os arrays para Exists e NotExists
  const existsArray = [];
  const notExistsArray = [];

  try{

    // Verifica a existência de cada sAMAccountName na tabela UsersModel
    for (const userObj of usersArray) {
      const { sAMAccountName } = userObj;
      const user = await UsersModel.findOne({ where: { login: sAMAccountName } });
    
      if (user) {
        existsArray.push(sAMAccountName);
      } else {
        notExistsArray.push(sAMAccountName);
      }
    }
    
    // Salva os resultados em um novo arquivo JSON
    const results = {
      Exists: existsArray,
      NotExists: notExistsArray
    };

    console.log(existsArray)
    console.log(notExistsArray)

      return res.json({ existsArray, notExistsArray });
  } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
  }
};




