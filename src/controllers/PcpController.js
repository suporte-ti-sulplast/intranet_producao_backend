const RelatorioKlProduzidoExtrusorasModel = require('../../models/RelatorioKlProduzidoExtrusoras');
var msg, msg_type;

// BUSCA TODOS AS PRODUÇÕES DA EXTRUSORA
exports.getProducaoExtrusora = async (req, res) => {

  try {
    const kProduzido = await RelatorioKlProduzidoExtrusorasModel.findAll({
      attributes: ['year','month','kProduced', 'idVal', 'createdAt'],
      raw: true,
      nest: true,
    }); 

    return res.json({ kProduzido });
  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// EDITA UM DADO DA TABELA
exports.editProducaoExtrusora = async (req, res) => {

  const {id, valor} = req.body;

  const novoValor = {
    kProduced: valor,
  };

  try {
    await RelatorioKlProduzidoExtrusorasModel.update(
      novoValor,
      {
        where: {
          idVal: id
        }
      }
    );
    
    msg = 'Valor alterado com sucesso';
    msg_type = 'success';
} catch (error) {
    console.error('Erro:', error);
    msg = 'Houve um erro interno.';
    msg_type = 'error';
  }

  return res.json({ msg, msg_type });
};


// ADICONA UM DADO DA TABELA
exports.addProducaoExtrusora = async (req, res) => {

  const {mes, ano, valor} = req.body;

  const novoValor = {
    year: ano,
    month: mes,
    kProduced: valor,
  };

  try {
    await RelatorioKlProduzidoExtrusorasModel.create(novoValor);
    
    msg = 'Valor adicionado com sucesso';
    msg_type = 'success';
} catch (error) {
    console.error('Erro:', error);
    msg = 'Houve um erro interno.';
    msg_type = 'error';
  }

  return res.json({ msg, msg_type });
};