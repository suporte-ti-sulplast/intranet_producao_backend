const Sequelize = require('sequelize');
const db = require('../srcOLD/conections/db');
const Status = require('./Status');
const AplicacoesDepartamentos = require('./AplicacoesDepartamentos');

const NiveisAcessos = db.define('NiveisAcessos',{
    idLevel: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    accessLevel: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
    },
    // Aqui definimos a chave estrangeira 'idStatus'
    idStatus: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
      references: {
      model: Status, // Nome da tabela referenciada
      key: 'idStatus' // Nome do campo referenciado na tabela 'Statuses'
      }
  },
});

NiveisAcessos.belongsTo(AplicacoesDepartamentos, {
  foreignKey: 'idLevel'
});

NiveisAcessos.sync()
  .then(() => {
    console.log('Tabela NiveisAcessos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela NiveisAcessos:', error);
  });

module.exports = NiveisAcessos;