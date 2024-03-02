const Sequelize = require('sequelize');
const db = require('../src/conections/db');

// Defina o modelo Voucher
const Vouchers = db.define('Vouchers', {
  idVouchers: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  voucher: {
    type: Sequelize.STRING(45),
    allowNull: false,
    unique: true,
  },
  time: {
    type: Sequelize.INTEGER(4),
    allowNull: false,
  },
  justification: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

//Vouchers.sync({force: true})
Vouchers.sync()
  .then(() => {
    console.log('Tabela  Vouchers criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela AccessApVoucherslications:', error);
  });

// Exporte o modelo
module.exports = Vouchers;
