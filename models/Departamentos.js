const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const NiveisAcessos = require('./NiveisAcessos');

const Departamentos = db.define('Departamentos',{
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

Departamentos.belongsTo(NiveisAcessos, {
  foreignKey: 'idLevel'
});

//Departamentos.sync({force: true})
Departamentos.sync()
  .then(() => {
    console.log('Tabela Departamentos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Departamentos:', error);
  });

module.exports = Departamentos;