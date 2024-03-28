const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');

// Defina o modelo SenhasCofres
const EmailsGruposUsuarios = db.define('EmailsGruposUsuarios', {
  idGrpUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  idGrp: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idUser: {
    type: Sequelize.INTEGER,
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
  createdUpdatedBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Usuarios.hasMany(EmailsGruposUsuarios, { foreignKey: 'idUser' });
EmailsGruposUsuarios.belongsTo(Usuarios, { foreignKey: 'idUser', as: 'emailsUser' });

// Defina as associações de chave estrangeira 
Usuarios.hasMany(EmailsGruposUsuarios, { foreignKey: 'createdUpdatedBy' });
EmailsGruposUsuarios.belongsTo(Usuarios, { foreignKey: 'createdUpdatedBy', as: 'createdByUser' });

//EmailsGruposUsuarios.sync({force: true})
EmailsGruposUsuarios.sync()
  .then(() => {
    console.log('Tabela criada EmailsGruposUsuarios com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela EmailsGruposUsuarios:', error);
  });

module.exports = EmailsGruposUsuarios;