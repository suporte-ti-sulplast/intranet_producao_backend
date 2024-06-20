const Sequelize = require('sequelize');
const db = require('../srcOLD/conections/db');

const Status = db.define('Status',{
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
},{
  tableName: 'Status',
});

//Status.sync({force: true})
Status.sync()
  .then(() => {
    console.log('Tabela Status criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel Status:', error);
  });

module.exports = Status;