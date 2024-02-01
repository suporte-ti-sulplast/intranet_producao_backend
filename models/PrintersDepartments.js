const Sequelize = require('sequelize');
const db = require('./db');
const Departments = require('./Departments');
const Printers = require('./Printers');

const PrintersDepartments = db.define('PrintersDepartments', {
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

  Printers.hasMany(PrintersDepartments, { foreignKey: 'idPrinter' });
  PrintersDepartments.belongsTo(Printers, { foreignKey: 'idPrinter' });
  
  Departments.hasMany(PrintersDepartments, { foreignKey: 'idDept' });
  PrintersDepartments.belongsTo(Departments, { foreignKey: 'idDept' });


//PrintersDepartments.sync({force: true})
PrintersDepartments.sync()
.then(() => {
  console.log('Tabela Printers criada com sucesso.');
})
.catch(error => {
  console.error('Erro ao criar a tabela Printers:', error);
});

module.exports = PrintersDepartments;
