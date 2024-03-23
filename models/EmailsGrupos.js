const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');

// Defina o modelo SenhasCofres
const EmailsGrupos = db.define('EmailsGrupos', {
  idGrp: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.STRING(40),
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Usuarios.hasMany(EmailsGrupos, { foreignKey: 'createdBy' });
EmailsGrupos.belongsTo(Usuarios, { foreignKey: 'createdBy', as: 'createdByUser' });

EmailsGrupos.sync({force: true})
//EmailsGrupos.sync()
  .then(() => {
    console.log('Tabela criada EmailsGrupos com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela EmailsGrupos:', error);
  });

module.exports = EmailsGrupos;