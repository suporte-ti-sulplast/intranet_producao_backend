const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Paineis = db.define('Paineis',{
  idPanel: {
    type: Sequelize.INTEGER(4),
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
    },
  name: {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    }
},{
  tableName: 'Paineis', // Adicione esta linha
});

//Paineis.sync({force: true})
Paineis.sync()
  .then(() => {
    console.log('Tabela Paineis criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Paineis:', error);
  });

module.exports = Paineis;