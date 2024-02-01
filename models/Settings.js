const Sequelize = require('sequelize');
const db = require('./db');

const Settings = db.define('Settings',{
    idSet: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    descriptionSet: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
    },
    valueSet: {
        type: Sequelize.STRING(40),
        allowNull: false,
    }
});

//Statuses.sync({force: true})
Settings.sync()
  .then(() => {
    console.log('Tabela Settings criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel Settings:', error);
  });

module.exports = Settings;