const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_BASE_DELSOFT,process.env.DB_USER_DELSOFT,process.env.DB_PASSWORD_DELSOFT, {
    host: process.env.DB_HOST_DELSOFT,
    dialect: process.env.DB_DIALECT_DELSOFT,
    dialectOptions: {
      options: {
        encrypt: true,
      },
    },
    query:{raw:true},
    timezone: '-03:00', // Define o fuso horário como São Paulo (GMT-03:00)
    define: {
      timestamps: true, // Ativar a criação dos campos createdAt e updatedAt
      underscored: false, // Use snake_case para os nomes das colunas
    },
})

sequelize.authenticate()
.then( () => {
    console.log ('Conexão com banco DELSOFT realizada com sucesso!')
}).catch (() => {
    console.log ('Erro: conexão com banco DELSOFT não realizada!')
})


module.exports = sequelize