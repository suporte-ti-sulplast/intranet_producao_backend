const Sequelize = require('sequelize');
const db = require('./db');
const Its = require('./Its');

const ItsDepartmentsViewers = db.define('ItsDepartmentsViewers',{
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

Its.hasMany(ItsDepartmentsViewers, { foreignKey: 'idIt' });
ItsDepartmentsViewers.belongsTo(Its, { foreignKey: 'idIt' });

//Departments.sync({force: true})
ItsDepartmentsViewers.sync()
  .then(() => {
    console.log('Tabela ITsViewers criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela ITsViewers:', error);
  });

module.exports = ItsDepartmentsViewers;