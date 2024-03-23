const Sequelize = require('sequelize');
const db = require('../src/conections/db');

// Defina o modelo SenhasCofres
const SenhasAntigas = db.define('SenhasAntigas', {
  idPassOld: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  idPassword: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  idUser: {
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

//SenhasAntigas.sync({force: true})
SenhasAntigas.sync()
  .then(() => {
    console.log('Tabela criada SenhasAntigas com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela SenhasAntigas:', error);
  });

module.exports = SenhasAntigas;