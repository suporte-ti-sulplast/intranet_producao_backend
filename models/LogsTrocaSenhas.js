const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const LogsTrocaSenhas = db.define('LogsTrocaSenhas',{
  idLog: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userLogin: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  ipAddress: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  createdAlterated: {
    type: Sequelize.STRING(1),
    allowNull: false,
  },
  createdAlteratedBy: {
    type: Sequelize.STRING(40),
    allowNull: false,
  }, 
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
    field: 'createdAt',
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
    field: 'updatedAt',
  },
}, {
  // Opções de configuração do modelo
  timestamps: true,
  underscored: false,
  timezone: '-03:00', // Configura o fuso horário para São Paulo (GMT-03:00)
});

//LogsTrocaSenhas.sync({force: true})
LogsTrocaSenhas.sync()
  .then(() => {
    console.log('Tabela LogsTrocaSenhas criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela LogsTrocaSenhas:', error);
  });

module.exports = LogsTrocaSenhas;