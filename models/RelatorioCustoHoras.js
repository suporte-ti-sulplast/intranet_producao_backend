const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const CentroCustos = require('./CentroCustos');

const RelatorioCustoHoras = db.define('RelatorioCustoHoras', {
  idRelCusHoras: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  month: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idCostCenter: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  coustHours: {
    type: Sequelize.DECIMAL(10, 2),
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

// Defina as associações de chave estrangeira 
CentroCustos.hasMany(RelatorioCustoHoras, { foreignKey: 'idCostCenter', as: 'CentroCusto'});
RelatorioCustoHoras.belongsTo(CentroCustos, { foreignKey: 'idCostCenter', as: 'CentroCusto' });

//RelatorioCustoHoras.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
RelatorioCustoHoras.sync()
  .then(() => {
    console.log('Tabela RelatorioCustoHoras criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela RelatorioCustoHoras:', error);
  });

module.exports = RelatorioCustoHoras;
