const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Its = require('./Its');

const ITsVisualizadores = db.define('ITsVisualizadores',{
  idItDeptViewer: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idIt: {
        type: Sequelize.INTEGER,
        allowNull: false
     },
     idDept: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
});

Its.hasMany(ITsVisualizadores, { foreignKey: 'idIt' });
ITsVisualizadores.belongsTo(Its, { foreignKey: 'idIt' });

//ITsVisualizadores.sync({force: true})
ITsVisualizadores.sync()
  .then(() => {
    console.log('Tabela ITsVisualizadores criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela ITsVisualizadores:', error);
  });

module.exports = ITsVisualizadores;