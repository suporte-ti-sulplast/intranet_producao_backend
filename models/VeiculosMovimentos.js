const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const VeiculosMovimentos = db.define('VeiculosMovimentos',{
    id: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    vehicle_id: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
    },
    destiny: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    departure_driver: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    departure_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    departure_time: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    departure_km: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
    },
    departure_liberator: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    departure_observation: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    arrival_driver: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    arrival_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    arrival_time: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    arrival_km: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
    },
    arrival_liberator: {
        type: Sequelize.STRING(50),
        allowNull: true,
    },
    arrival_observation: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    inOuut: {
        type: Sequelize.STRING(3),
        allowNull: true,
        default: false,
    }
});

//VeiculosMovimentos.sync({force: true})
VeiculosMovimentos.sync()
  .then(() => {
    console.log('Tabela VeiculosMovimentos criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela VeiculosMovimentos:', error);
  });

module.exports = VeiculosMovimentos;