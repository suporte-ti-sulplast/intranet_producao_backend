const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const LogsAcessos = db.define('LogsAcessos',{
  idLog: {
      type: Sequelize.INTEGER(4),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
  userLogin: {
      type: Sequelize.STRING(40),
      allowNull: false,
  },
  status: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  action: {
      type: Sequelize.STRING(40),
      allowNull: false,
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  failedAttempts: {
    type: Sequelize.INTEGER(4),
    allowNull: false,
},
  ipAddress: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  browser: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
});

//LogsAcessos.sync({force: true})
LogsAcessos.sync()
  .then(() => {
    console.log('Tabela LogsAcessos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela LogsAcessos:', error);
  });

module.exports = LogsAcessos;