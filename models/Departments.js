const Sequelize = require('sequelize');
const db = require('./db');
const AccessLevels = require('./AccessLevels');

const Departments = db.define('Departments',{
    idDept: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    department: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
    },
    supervisor: {
        type: Sequelize.STRING(40),
        allowNull: true,
    }
});

Departments.belongsTo(AccessLevels, {
  foreignKey: 'idLevel'
});

//Departments.sync({force: true})
Departments.sync()
  .then(() => {
    console.log('Tabela Departments criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Departments:', error);
  });

module.exports = Departments;