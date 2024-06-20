const Sequelize = require('sequelize');
const db = require('../srcOLD/conections/db');
const Applications = require('./Aplicacoes');

const AplicacoesDepartamentos = db.define('AplicacoesDepartamentos',{

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

AplicacoesDepartamentos.belongsTo(Applications, {
  foreignKey: 'idApplications'
});

//AplicacoesDepartamentos.sync({force: true})
AplicacoesDepartamentos.sync()
  .then(() => {
    console.log('Tabela  AplicacoesDepartamentos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela AplicacoesDepartamentos:', error);
  });

module.exports = AplicacoesDepartamentos;