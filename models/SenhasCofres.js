const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');
const SenhasCategorias = require('./SenhasCategorias');

// Defina o modelo SenhasCofres
const SenhasCofres = db.define('SenhasCofres', {
  idPassword: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  userName: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  descriptionPass: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
  idPasswordCategory: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  email_1: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
  email_2: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Usuarios.hasMany(SenhasCofres, { foreignKey: 'createdBy' });
SenhasCofres.belongsTo(Usuarios, { foreignKey: 'createdBy', as: 'createdByUser' });

// Defina as associações de chave estrangeira 
Usuarios.hasMany(SenhasCofres, { foreignKey: 'updatedBy' });
SenhasCofres.belongsTo(Usuarios, { foreignKey: 'updatedBy', as: 'updatedByUser' });

// Defina as associações de chave estrangeira 
SenhasCategorias.hasMany(SenhasCofres, { foreignKey: 'idPasswordCategory' });
SenhasCofres.belongsTo(SenhasCategorias, { foreignKey: 'idPasswordCategory', as: 'category' });

//SenhasCofres.sync({force: true})
SenhasCofres.sync()
  .then(() => {
    console.log('Tabela criada SenhasCofres com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela SenhasCofres:', error);
  });

module.exports = SenhasCofres;