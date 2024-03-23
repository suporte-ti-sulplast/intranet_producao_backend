const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const SenhasCategorias = db.define('SenhasCategorias', {
  idPasswordCategory: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  category: {
    type: Sequelize.STRING(45),
    allowNull: false,
    unique: true,
  },
  idStatus: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});


//SenhasCofres.sync({force: true})
SenhasCategorias.sync()
  .then(() => {
    console.log('Tabela criada SenhasCategorias com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela SenhasCategorias:', error);
  });

module.exports = SenhasCategorias;