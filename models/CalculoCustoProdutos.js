const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const CalculoCustoProdutos = db.define('CalculoCustoProdutos', {
  idCCP: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  reference_date: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  custo_total: {
    type: Sequelize.DECIMAL(16,6),
    allowNull: false,
  },
  itens_total: {
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


//CalculoCustoProdutos.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
CalculoCustoProdutos.sync()
  .then(() => {
    console.log('Tabela CalculoCustoProdutos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela CalculoCustoProdutos:', error);
  });

module.exports = CalculoCustoProdutos;

// Importe Usuarios após a definição de Departamentos para evitar círculos de dependência
const Usuarios = require('./Usuarios');

// Defina as associações após a importação de Usuarios
CalculoCustoProdutos.belongsTo(Usuarios, {
  foreignKey: 'createdBy',
  as: 'createdByUser'
});
