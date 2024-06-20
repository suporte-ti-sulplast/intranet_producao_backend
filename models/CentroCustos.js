const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const CentroCustos = db.define('CentroCustos', {
  idCC: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  nameCostCenter: {
    type: Sequelize.STRING(30),
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


//CentroCustos.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
CentroCustos.sync()
  .then(() => {
    console.log('Tabela CentroCustos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela CentroCustos:', error);
  });

module.exports = CentroCustos;
