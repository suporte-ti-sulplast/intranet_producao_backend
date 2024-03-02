const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Departamentos = require('../models/Departamentos');

const Ramais = db.define('Ramais', {
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
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  extensionsNumber: {
    type: Sequelize.STRING(4),
    allowNull: false,
  },
  externalSuffix: {
    type: Sequelize.STRING(6),
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

Departamentos.hasMany(Ramais, { foreignKey: 'idDept' });
Ramais.belongsTo(Departamentos, { foreignKey: 'idDept', as: 'department' });

//Ramais.sync({force: true})
Ramais.sync()
  .then(() => {
    console.log('Tabela criada Ramais com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Ramais:', error);
  });

module.exports = Ramais;