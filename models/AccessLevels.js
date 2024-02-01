const Sequelize = require('sequelize');
const db = require('./db');
const Statuses = require('./Statuses');
const AccessAplications = require('./AccessAplications');

const AccessLevels = db.define('AccessLevels',{
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
      model: Statuses, // Nome da tabela referenciada
      key: 'idStatus' // Nome do campo referenciado na tabela 'Statuses'
      }
  },
});

AccessLevels.belongsTo(AccessAplications, {
  foreignKey: 'idLevel'
});

AccessLevels.sync()
  .then(() => {
    console.log('Tabela AccessLevels criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela AccessLevels:', error);
  });

module.exports = AccessLevels;