const Sequelize = require('sequelize');
const db = require('./db');
const P01_panels = require('./P01_panels');

const P01_panelsDepartments = db.define('P01_panelsDepartments',{
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

P01_panels.hasMany(P01_panelsDepartments, { foreignKey: 'idPanel' , as: 'panel' });
P01_panelsDepartments.belongsTo(P01_panels, { foreignKey: 'idPanel', as: 'panel' });

//Departments.sync({force: true})
P01_panelsDepartments.sync()
  .then(() => {
    console.log('Tabela P01_panelsDepartments criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela P01_panelsDepartments:', error);
  });

module.exports = P01_panelsDepartments;