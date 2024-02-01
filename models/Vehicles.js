const Sequelize = require('sequelize');
const db = require('./db');
const PortariaControleVeiculos = require('./VehiclesMoviments');

const Vehicles = db.define('Vehicles',{
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
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
});

Vehicles.hasMany(PortariaControleVeiculos, { foreignKey: 'vehicle_id' });
PortariaControleVeiculos.belongsTo(Vehicles, { foreignKey: 'vehicle_id' });

//LogsAcessos.sync({force: true})
Vehicles.sync()
  .then(() => {
    console.log('Tabela Vehicles criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela Vehicles:', error);
  });


module.exports = Vehicles;