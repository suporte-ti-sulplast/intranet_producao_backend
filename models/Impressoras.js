const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');

const Impressoras = db.define('Impressoras', {
    idPrinter: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    printerName: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    idStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
     },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
    manufacturer: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    model: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    netUsb: {
      type: Sequelize.STRING(5),
      allowNull: false
    },
    ip: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    location: {
      type: Sequelize.STRING(25),
      allowNull: false
    },
  });

  Usuarios.hasMany(Impressoras, { foreignKey: 'createdBy' });
  Impressoras.belongsTo(Usuarios, { foreignKey: 'createdBy', as: 'createdByUser' });

  Usuarios.hasMany(Impressoras, { foreignKey: 'updatedBy' });
  Impressoras.belongsTo(Usuarios, { foreignKey: 'updatedBy', as: 'updatedByUser' });

//Impressoras.sync({force: true})
Impressoras.sync()
.then(() => {
  console.log('Tabela Impressoras criada com sucesso.');
})
.catch(error => {
  console.error('Erro ao criar a tabela Impressoras:', error);
});

module.exports = Impressoras;
