const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const Noticias = db.define('Noticias',{
    idNews: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(255),
    },
    date: {
      type: Sequelize.STRING(255),
    },
    text: {
        type: Sequelize.STRING(750),
    },
    link: {
      type: Sequelize.STRING(255),
    },
    idStatus: {
      type: Sequelize.INTEGER,
    },
    dateInit: {
      type: Sequelize.DATEONLY,
    },
    dateEnd: {
      type: Sequelize.DATEONLY,
    },
});

//Noticias.sync({force: true})
Noticias.sync()
  .then(() => {
    console.log('Tabela Noticias criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel Noticias:', error);
  });

module.exports = Noticias;