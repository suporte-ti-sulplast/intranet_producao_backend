const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const VersionControllers = db.define('VersionControllers', {
    idVersion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    version: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    modificationType: {
      type: Sequelize.STRING(1),
    },
    bdFrontBack: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    modifications: {
      type: Sequelize.STRING(1500),
      allowNull: false,
    },
    created: {
      type: Sequelize.STRING(1500),
      allowNull: false,
    },
    alterated: {
      type: Sequelize.STRING(1500),
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

//VersionControllers.sync({force: true})
VersionControllers.sync()
  .then(() => {
    console.log('Tabela VersionControllers criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela VersionControllers:', error);
  });

module.exports = VersionControllers;