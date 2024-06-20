require('dotenv').config()
const LogsTrocaSenhasModel = require('../../models/LogsTrocaSenhas');

//BUSCA LOG DE ALTERAÇÃO DE SENHA*******************************************************************************************
exports.alteracaoSenha = async (req, res) => {

  try {
    const logs = await LogsTrocaSenhasModel.findAll({
      where: { /* suas condições de busca */ },
      raw: true, // Retorna os resultados como objetos simples, sem instâncias do Sequelize
      nest: true, // Aninhar os resultados para evitar arrays aninhados
      timezone: '-03:00', // Configura o fuso horário para São Paulo (GMT-03:00)
    })

      return res.json({ logs });
      
  } catch (error) {
      console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  };
};

