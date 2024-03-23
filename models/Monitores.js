const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Monitores = db.define('Monitores', {
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
      status: {
        type: Sequelize.BOOLEAN,
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
        type: Sequelize.STRING(1),
        defaultValue: null,
      },
      emailTempModerate: {
        type: Sequelize.STRING(1),
        defaultValue: null,
      },
      emailTempHigh: {
        type: Sequelize.STRING(1),
        defaultValue: null,
      },
      emailTempDisaster: {
        type: Sequelize.STRING(1),
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

//Monitores.sync({force: true})
Monitores.sync()
.then(() => {
  console.log('Tabela Monitores criada com sucesso.');
})
.catch(error => {
  console.error('Erro ao criar a tabela Monitores:', error);
});

module.exports = Monitores;