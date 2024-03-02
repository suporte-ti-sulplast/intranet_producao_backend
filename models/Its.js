const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Its = db.define('Its',{
    idIt: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    itName: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true
     },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: true
   },
});

//Departments.sync({force: true})
Its.sync()
  .then(() => {
    console.log('Tabela ITs criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela ITs:', error);
  });

module.exports = Its;