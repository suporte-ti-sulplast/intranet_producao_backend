const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Departamentos = require('./Departamentos');
const Telas = require('./Telas');

const TelasPermissoes = db.define('TelasPermissoesDepartamentos', {
  idViewPermission: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idDept: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  idView: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

// Defina as associações de chave estrangeira 
Departamentos.hasMany(TelasPermissoes, { foreignKey: 'idDept' });
TelasPermissoes.belongsTo(Departamentos, { foreignKey: 'idDept', as: 'Depto' });

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

