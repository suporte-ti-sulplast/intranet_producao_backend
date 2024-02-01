const Sequelize = require('sequelize');
const db = require('./db');
const Users = require('./Users');

const Printers = db.define('Printers', {
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
    status: {
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

  Users.hasMany(Printers, { foreignKey: 'createdBy' });
  Printers.belongsTo(Users, { foreignKey: 'createdBy', as: 'createdByUser' });

  Users.hasMany(Printers, { foreignKey: 'updatedBy' });
  Printers.belongsTo(Users, { foreignKey: 'updatedBy', as: 'updatedByUser' });

//Printers.sync({force: true})
Printers.sync()
.then(() => {
  console.log('Tabela Printers criada com sucesso.');
})
.catch(error => {
  console.error('Erro ao criar a tabela Printers:', error);
});

module.exports = Printers;
