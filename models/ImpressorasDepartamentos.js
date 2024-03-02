const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const Departamentos = require('./Departamentos');
const Impressoras = require('./Impressoras');

const ImpressorasDepartamentos = db.define('ImpressorasDepartamentos', {
    idPrintersDepartments: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idPrinter: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    idDept: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
  });

  Impressoras.hasMany(ImpressorasDepartamentos, { foreignKey: 'idPrinter' });
  ImpressorasDepartamentos.belongsTo(Impressoras, { foreignKey: 'idPrinter' });
  
  Departamentos.hasMany(ImpressorasDepartamentos, { foreignKey: 'idDept' });
  ImpressorasDepartamentos.belongsTo(Departamentos, { foreignKey: 'idDept' });


//ImpressorasDepartamentos.sync({force: true})
ImpressorasDepartamentos.sync()
.then(() => {
  console.log('Tabela ImpressorasDepartamentos criada com sucesso.');
})
.catch(error => {ImpressorasDepartamentos
  console.error('Erro ao criar a tabela Printers:', error);
});

module.exports = ImpressorasDepartamentos;
