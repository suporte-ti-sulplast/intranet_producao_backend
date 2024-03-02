const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Paineis = require('./Paineis');

const PaineisDepartamentos = db.define('PaineisDepartamentos',{
  idDeptPanel: {
    type: Sequelize.INTEGER(4),
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
    },
  idPanel: {
    type: Sequelize.INTEGER(4),
      allowNull: false,
    },
  idDept: {
    type: Sequelize.INTEGER(4),
      allowNull: false,
    }
});

Paineis.hasMany(PaineisDepartamentos, { foreignKey: 'idPanel' , as: 'Paineis' });
PaineisDepartamentos.belongsTo(Paineis, { foreignKey: 'idPanel', as: 'Paineis' });

//PaineisDepartamentos.sync({force: true})
PaineisDepartamentos.sync()
  .then(() => {
    console.log('Tabela PaineisDepartamentos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela PaineisDepartamentos:', error);
  });

module.exports = PaineisDepartamentos;