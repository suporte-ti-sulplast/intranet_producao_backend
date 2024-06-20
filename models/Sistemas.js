const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Sistemas = db.define('Sistemas', {
  idSys: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  system: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});


//Sistemas.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
Sistemas.sync()
  .then(() => {
    console.log('Tabela Sistemas criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Sistemas:', error);
  });

module.exports = Sistemas;
