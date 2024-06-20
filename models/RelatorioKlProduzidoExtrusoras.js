const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const RelatorioKlProduzidoExtrusoras = db.define('RelatorioKlProduzidoExtrusoras', {
  idVal: {
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
  kProduced: {
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


//RelatorioKlProduzidoExtrusoras.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
RelatorioKlProduzidoExtrusoras.sync()
  .then(() => {
    console.log('Tabela RelatorioKlProduzidoExtrusoras criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela RelatorioKlProduzidoExtrusoras:', error);
  });

module.exports = RelatorioKlProduzidoExtrusoras;
