const Sequelize = require('sequelize');
const db = require('../srcOLD/conections/db');

const Aplicacoes = db.define('Aplicacoes',{
    idApplications: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    applications: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
    },
    image: {
      type: Sequelize.STRING(20),
      allowNull: false,
  },        
    // Aqui definimos a chave estrangeira 'idStatus'
    idStatus: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
        model: 'Status', // Nome da tabela referenciada
        key: 'idStatus' // Nome do campo referenciado na tabela 'Statuses'
        }
    },
});

//Aplicacoes.sync({force: true})
Aplicacoes.sync()
  .then(() => {
    console.log('Tabela criada Aplicacoes com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Aplicacoes:', error);
  });

module.exports = Aplicacoes;