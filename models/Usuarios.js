const Sequelize = require('sequelize');
const db = require('../srcOLD/conections/db');
const Departamentos = require('./Departamentos');
const Status = require('./Status');

const Usuarios = db.define('Usuarios',{
    idUser: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    login: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    nameComplete: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    idStatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    idDept: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
    },
    codCQ: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    passwordOld1: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    passwordOld2: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    sendEmail: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    agePassword: {
      type: Sequelize.DATE,
    },
    forcedChangePassword: {
      type: Sequelize.STRING(1),
    },
    birthdate: {
      type: Sequelize.STRING(5),
    },
    idPanel:  {
      type: Sequelize.INTEGER,
    },
    badge:  {
      type: Sequelize.STRING(100),
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
});

    Usuarios.belongsTo(Departamentos, {
      foreignKey: 'idDept'
    });

    Usuarios.belongsTo(Status, {
        foreignKey: 'idStatus'
      });

//Usuarios.sync({force: true});
Usuarios.sync()
  .then(() => {
    console.log('Tabela Usuarios criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Usuarios:', error);
  });

module.exports = Usuarios;