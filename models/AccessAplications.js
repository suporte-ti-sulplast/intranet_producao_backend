const Sequelize = require('sequelize');
const db = require('./db');
const Applications = require('./Applications');

const AccessAplications = db.define('AccessAplications',{

  idAccessAplications: {
      type: Sequelize.INTEGER(4),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
  },
    // Aqui definimos a chave estrangeira 'idLevel'

    idDept: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
        model: 'AccessLevels', // Nome da tabela referenciada
        key: 'idLevel' // Nome do campo referenciado na tabela 'AccessLevels'
        }
      },
    // Aqui definimos a chave estrangeira 'idApplications'
    idApplications: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
        model: 'Applications', // Nome da tabela referenciada
        key: 'idApplications' // Nome do campo referenciado na tabela 'Applications'
        }
    }
});

AccessAplications.belongsTo(Applications, {
  foreignKey: 'idApplications'
});

//AccessAplications.sync({force: true})
AccessAplications.sync()
  .then(() => {
    console.log('Tabela  AccessAplications criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela AccessAplications:', error);
  });

module.exports = AccessAplications;