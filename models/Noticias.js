const Sequelize = require('sequelize');
const db = require('../src/conections/db');

const News = db.define('Noticias',{
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
    imageName: {
      type: Sequelize.STRING(255),
    },
    link: {
      type: Sequelize.STRING(255),
    },
    image: {
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
    idNewsCategory: {
      type: Sequelize.INTEGER(4),
    },
});

//News.sync({force: true})
News.sync()
  .then(() => {
    console.log('Tabela News criada com sucesso.');
  })
  .catch(error => {
    console.error('Erro ao criar a tabel News:', error);
  });

module.exports = News;