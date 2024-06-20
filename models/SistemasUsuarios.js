const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');
const Sistemas = require('./Sistemas');

const SistemasUsuarios = db.define('SistemasUsuarios', {
  idSysUser: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idSys: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Usuarios.hasMany(SistemasUsuarios, { foreignKey: 'idUser' });
SistemasUsuarios.belongsTo(Usuarios, { foreignKey: 'idUser', as: 'User' });

// Defina as associações de chave estrangeira 
Sistemas.hasMany(SistemasUsuarios, { foreignKey: 'idSys' });
SistemasUsuarios.belongsTo(Sistemas, { foreignKey: 'idSys', as: 'System' });


//SistemasUsuarios.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela
SistemasUsuarios.sync()
  .then(() => {
    console.log('Tabela SistemasUsuarios criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela SistemasUsuarios:', error);
  });

module.exports = SistemasUsuarios;

