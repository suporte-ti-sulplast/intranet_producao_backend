const Sequelize = require('sequelize');
const db = require('../src/conections/db');

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
    supervisor1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
    },
    supervisor2: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
  },
    inactivityTime: {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
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

// Importe Usuarios após a definição de Departamentos para evitar círculos de dependência
const Usuarios = require('./Usuarios');

// Defina as associações após a importação de Usuarios
Departamentos.belongsTo(Usuarios, {
  foreignKey: 'supervisor1',
  as: 'super1'
});
Departamentos.belongsTo(Usuarios, {
  foreignKey: 'supervisor2',
  as: 'super2'
});