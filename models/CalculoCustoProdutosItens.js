const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const CalculoCustoProdutosItens = db.define('CalculoCustoProdutosItens', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  calculo_custo_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  codigo: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  custo: {
    type: Sequelize.DECIMAL(16,6),
    allowNull: true,
  },
  quantidade_mao_de_obra: {
    type: Sequelize.DECIMAL(16,7),
    allowNull: true,
  },
  valor_mao_de_obra: {
    type: Sequelize.DECIMAL(16,7),
    allowNull: true,
  },
  valor_item: {
    type: Sequelize.DECIMAL(16,7),
    allowNull: true,
  },
  calculado: {
    type: Sequelize.INTEGER(1),
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


//CalculoCustoProdutosItens.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
CalculoCustoProdutosItens.sync()
  .then(() => {
    console.log('Tabela CalculoCustoProdutosItens criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela CalculoCustoProdutosItens:', error);
  });

module.exports = CalculoCustoProdutosItens;
