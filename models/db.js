const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_BASE,process.env.DB_USER,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    query:{raw:true},
    timezone: '-03:00', // Define o fuso horário como São Paulo (GMT-03:00)
    define: {
      timestamps: true, // Ativar a criação dos campos createdAt e updatedAt
      underscored: false, // Use snake_case para os nomes das colunas
    },
})

sequelize.authenticate()
.then( () => {
    console.log ('Conexão com banco MYSQL realizada com sucesso!')
}).catch (() => {
    console.log ('Erro: conexão com banco MYSQL não realizada!')
})


module.exports = sequelize