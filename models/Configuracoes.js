const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Configuracoes = db.define('Configuracoes',{
    idSet: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    descriptionSet: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
    },
    valueSet: {
        type: Sequelize.STRING(40),
        allowNull: false,
    }
});

//Configuracoes.sync({force: true})
Configuracoes.sync()
  .then(() => {
    console.log('Tabela Configuracoes criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel Configuracoes:', error);
  });

module.exports = Configuracoes;