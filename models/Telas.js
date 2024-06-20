const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');

const Telas = db.define('Telas', {
  idView: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  viewName: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  viewDescription: {
    type: Sequelize.STRING(100),
    allowNull: false,
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
Usuarios.hasMany(Telas, { foreignKey: 'createdBy' });
Telas.belongsTo(Usuarios, { foreignKey: 'createdBy', as: 'createdByUser' });

//Telas.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela//
Telas.sync()
  .then(() => {
    console.log('Tabela Telas criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Telas:', error);
  });

module.exports = Telas;
