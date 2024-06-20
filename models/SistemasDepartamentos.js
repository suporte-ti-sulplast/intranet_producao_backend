const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Departamentos = require('./Departamentos');
const Sistemas = require('./Sistemas');

const SistemasDepartamentos = db.define('SistemasDepartamentos', {
  idSysDept: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idDept: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idSys: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Departamentos.hasMany(SistemasDepartamentos, { foreignKey: 'idDept' });
SistemasDepartamentos.belongsTo(Departamentos, { foreignKey: 'idDept', as: 'Depto' });

// Defina as associações de chave estrangeira 
Sistemas.hasMany(SistemasDepartamentos, { foreignKey: 'idSys' });
SistemasDepartamentos.belongsTo(Sistemas, { foreignKey: 'idSys', as: 'System' });


//SistemasDepartamentos.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela
SistemasDepartamentos.sync()
  .then(() => {
    console.log('Tabela SistemasDepartamentos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela SistemasDepartamentos:', error);
  });

module.exports = SistemasDepartamentos;

