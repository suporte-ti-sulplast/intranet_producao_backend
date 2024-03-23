const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Its = require('./Its');
const Departamentos = require('./Departamentos');

const ITsElaboradores = db.define('ITsElaboradores',{
  idItDeptOwner: {
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


Its.hasMany(ITsElaboradores, { foreignKey: 'idIt'  });
ITsElaboradores.belongsTo(Its, { foreignKey: 'idIt' });

Departamentos.hasMany(ITsElaboradores, { foreignKey: 'idDept'  });
ITsElaboradores.belongsTo(Departamentos, { foreignKey: 'idDept' });


//ITsElaboradores.sync({force: true})
ITsElaboradores.sync()
  .then(() => {
    console.log('Tabela ITsElaboradores criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela ITsElaboradores:', error);
  });

module.exports = ITsElaboradores;