const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const CentroCustos = require('./CentroCustos');

const RelatorioEvolucaoCustoPorDeptos = db.define('RelatorioEvolucaoCustoPorDeptos', {
  idRel: {
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
  idCC: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  productionHour: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  productionMinute: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  proratedCost: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  minuteCost: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  percentual: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  kProduced: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  kPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  costHour: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
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
CentroCustos.hasMany(RelatorioEvolucaoCustoPorDeptos, { foreignKey: 'idCC' });
RelatorioEvolucaoCustoPorDeptos.belongsTo(CentroCustos, { foreignKey: 'idCC', as: 'centroCusto' });


//RelatorioEvolucaoCustoPorDeptos.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
RelatorioEvolucaoCustoPorDeptos.sync()
  .then(() => {
    console.log('Tabela RelatorioEvolucaoCustoPorDeptos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela RelatorioEvolucaoCustoPorDeptos:', error);
  });

module.exports = RelatorioEvolucaoCustoPorDeptos;
