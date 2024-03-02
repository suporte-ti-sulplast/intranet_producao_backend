const Sequelize = require('sequelize');
const db = require('../src/conections/db');
const VeiculosMovimentos = require('./VeiculosMovimentos');

const Veiculos = db.define('Veiculos',{
    vehicle_id: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    vehicle_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    make_model: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    year: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
    },
    license_plate: {
        type: Sequelize.STRING(7),
        allowNull: false,
    },
    chassis: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    color: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    idStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING(30),
        allowNull: false,
    } 
    });

Veiculos.hasMany(VeiculosMovimentos, { foreignKey: 'vehicle_id' });
VeiculosMovimentos.belongsTo(Veiculos, { foreignKey: 'vehicle_id' });

//Veiculos.sync({force: true})
Veiculos.sync()
  .then(() => {
    console.log('Tabela Veiculos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Veiculos:', error);
  });


module.exports = Veiculos;