const Sequelize = require('sequelize');
const db = require('./db');
const Departments = require('../models/Departments');

const TelephoneExtension = db.define('TelephoneExtensions', {
  idTelExt: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idDept: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nameUsers: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  extensionsNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  externalSuffix: {
    type: Sequelize.STRING,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    onUpdate: Sequelize.NOW,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

Departments.hasMany(TelephoneExtension, { foreignKey: 'idDept' });
TelephoneExtension.belongsTo(Departments, { foreignKey: 'idDept', as: 'department' });

//Applications.sync({force: true})
TelephoneExtension.sync()
  .then(() => {
    console.log('Tabela criada TelephoneExtension com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela TelephoneExtension:', error);
  });

module.exports = TelephoneExtension;