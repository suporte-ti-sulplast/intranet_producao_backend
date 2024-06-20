const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Usuarios = require('./Usuarios');
const Telas = require('./Telas');

const TelasPermissoes = db.define('TelasPermissoesUsuarios', {
  idViewPermission: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idView: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Usuarios.hasMany(TelasPermissoes, { foreignKey: 'idUser' });
TelasPermissoes.belongsTo(Usuarios, { foreignKey: 'idUser', as: 'User' });

// Defina as associações de chave estrangeira 
Telas.hasMany(TelasPermissoes, { foreignKey: 'idView' });
TelasPermissoes.belongsTo(Telas, { foreignKey: 'idView', as: 'View' });


//TelasPermissoes.sync({ force: true }) // Atenção: force: true irá forçar a recriação da tabela
TelasPermissoes.sync()
  .then(() => {
    console.log('Tabela TelasPermissoes criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela TelasPermissoes:', error);
  });

module.exports = TelasPermissoes;

