const Sequelize = require('sequelize');
const db = require('./db');

const Monitors = db.define('Monitors', {
    idMonitor: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      monitorName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      idStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      equipament: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      emailReceive: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      tempAttention: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tempModerate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tempHigh: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tempDisaster: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      emailTempAttention: {
        type: Sequelize.STRING(3),
        defaultValue: null,
      },
      emailTempModerate: {
        type: Sequelize.STRING(3),
        defaultValue: null,
      },
      emailTempHigh: {
        type: Sequelize.STRING(3),
        defaultValue: null,
      },
      emailTempDisaster: {
        type: Sequelize.STRING(3),
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(15),
        defaultValue: null,
      },
  });

//Printers.sync({force: true})
Monitors.sync()
.then(() => {
  console.log('Tabela Monitors criada com sucesso.');
})
.catch(error => {
  console.error('Erro ao criar a tabela Monitors:', error);
});

module.exports = Monitors;