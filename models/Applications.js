const Sequelize = require('sequelize');
const db = require('./db');

const Applications = db.define('Applications',{
    idApplications: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    applications: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,
    },
    image: {
      type: Sequelize.STRING(20),
      allowNull: false,
  },        
    // Aqui definimos a chave estrangeira 'idStatus'
    idStatus: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
        model: 'Statuses', // Nome da tabela referenciada
        key: 'idStatus' // Nome do campo referenciado na tabela 'Statuses'
        }
    },
});

//Applications.sync({force: true})
Applications.sync()
  .then(() => {
    console.log('Tabela criada Applications com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Applications:', error);
  });

module.exports = Applications;