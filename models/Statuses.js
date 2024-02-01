const Sequelize = require('sequelize');
const db = require('./db');

const Statuses = db.define('Statuses',{
    idStatus: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
    }
});

//Statuses.sync({force: true})
Statuses.sync()
  .then(() => {
    console.log('Tabela Statuses criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel Statuses:', error);
  });

module.exports = Statuses;