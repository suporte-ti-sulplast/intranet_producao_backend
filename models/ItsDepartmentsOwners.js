const Sequelize = require('sequelize');
const db = require('./db');
const Its = require('./Its');
const Departments = require('./Departments');

const ItsDepartmentsOwners = db.define('ItsDepartmentsOwners',{
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


Its.hasMany(ItsDepartmentsOwners, { foreignKey: 'idIt'  });
ItsDepartmentsOwners.belongsTo(Its, { foreignKey: 'idIt' });

Departments.hasMany(ItsDepartmentsOwners, { foreignKey: 'idDept'  });
ItsDepartmentsOwners.belongsTo(Departments, { foreignKey: 'idDept' });


//Departments.sync({force: true})
ItsDepartmentsOwners.sync()
  .then(() => {
    console.log('Tabela ITsDepartments criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela ITsDepartments:', error);
  });

module.exports = ItsDepartmentsOwners;