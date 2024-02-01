const Sequelize = require('sequelize');
const db = require('./db');

const P01_panels = db.define('P01_panels',{
  idPanel: {
    type: Sequelize.INTEGER(4),
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
    },
  name: {
      type: Sequelize.STRING(45),
      allowNull: false,
      unique: true,
    }
},{
  tableName: 'P01_panels', // Adicione esta linha
});

//Departments.sync({force: true})
P01_panels.sync()
  .then(() => {
    console.log('Tabela P01_panels criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela P01_panels:', error);
  });

module.exports = P01_panels;