const Sequelize = require('sequelize');
const db = require('./db');
const Departments = require('./Departments');
const Statuses = require('./Statuses');

const Users = db.define('Users',{
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
    sharedUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    idStatus: {
      type: Sequelize.INTEGER(4),
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
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    agePassword: {
      type: Sequelize.DATE,
    },
    forcedChangePassword: {
      type: Sequelize.BOOLEAN,
    },
    birthdate: {
      type: Sequelize.STRING(5),
    },
});

    Users.belongsTo(Departments, {
      foreignKey: 'idDept'
    });

    Users.belongsTo(Statuses, {
        foreignKey: 'idStatus'
      });

//Users.sync({force: true});
Users.sync()
  .then(() => {
    console.log('Tabela Users criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Users:', error);
  });

module.exports = Users;