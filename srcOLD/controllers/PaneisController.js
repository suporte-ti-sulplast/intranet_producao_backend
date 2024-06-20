require('dotenv').config()
const fs = require('fs');

const PaineisDepartamentosModels = require('../../../models/PaineisDepartamentos');
const PaineisModels = require('../../../models/Paineis');
const UsuariosModel = require('../../../models/Usuarios');

//BUSCA PAINEIS E USUÁRIO NO BD
exports.panelSearch = async (req, res) => {

  const { idDept } = req.body;

  console.log('idDept', idDept)

  try {
        const painel = await PaineisDepartamentosModels.findOne({
          attributes: ['idPanel'],
          where: {idDept},
          include: [{
              model: PaineisModels,
              attributes: [ 'name'],
              as: 'Paineis',
          }],
          raw: true,
          nest: true,
      });

      const users = await UsuariosModel.findAll({
        attributes: ['nameComplete'],
        where: {idPanel: painel.idPanel},
        raw: true,
        nest: true,
        order: [['nameComplete', 'ASC']]
    });

    console.log( painel, users)

    return res.json({ painel, users });

  } catch (error) {
      console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  };

};

//SALVA DADOS NO ARQIVO
exports.panelSave = async (req, res) => {
  const { id, name, idDepto, local } = req.body;
  console.log(id, name, idDepto, local)

  // Caminho para o arquivo JSON
  const filePath = 'public/files/painel.js';

  // Lê o conteúdo atual do arquivo
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    try {
      // Converte o conteúdo do arquivo em um array JSON, ou um array vazio se o arquivo estiver vazio
      const jsonArray = data ? JSON.parse(data) : [];

      // Verifica se já existe um objeto com as mesmas propriedades
      const objetoExistente = jsonArray.find(
        (obj) => obj.id === id && obj.name === name && obj.idDepto === idDepto
      );

      // Se o objeto já existir, atualiza as propriedades locais
      if (objetoExistente) {
        objetoExistente.local = local;
      } else {
        // Caso contrário, adiciona um novo objeto ao array
        jsonArray.push({
          id: id,
          name: name,
          idDepto: idDepto,
          local: local,
        });
      }

      // Converte o array JSON de volta para uma string JSON
      const novoConteudo = JSON.stringify(jsonArray, null, 2);

      // Escreve o conteúdo modificado de volta no arquivo
      fs.writeFile(filePath, novoConteudo, 'utf8', (err) => {
        if (err) {
          console.error('Erro ao escrever no arquivo:', err);
          return res.status(500).send('Erro ao escrever no arquivo.');
        }

        res.status(200).send('Arquivo atualizado com sucesso!');
      });
    } catch (parseError) {
      console.error('Erro ao analisar o conteúdo do arquivo como JSON:', parseError);
      res.status(500).send('Erro ao analisar o conteúdo do arquivo como JSON.');
    }
  });
};


exports.panelData = async (req, res) => {

  const { idDept} = req.body

  try {
    // Caminho do arquivo
    const filePath = '/var/www/backend/public/files/painel.js';

    // Lê o conteúdo do arquivo
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Converte o conteúdo para um objeto JavaScript (assumindo que é um arquivo JSON)
    const data = JSON.parse(fileContent);

    // Filtra os dados que correspondem ao idDept
    const filteredData = data.filter(item => item.idDepto === parseInt(idDept) || item.idDepto === parseInt(1)); //coloquei o 1 provisóriamente para aceitar o Bruno

    // Extrai apenas as propriedades desejadas (id, name, local)
    const result = filteredData.map(({ id, name, local }) => ({ id, name, local }));
    return res.json(result);
  } catch (error) {
    console.error('Erro ao buscar dados do arquivo:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do arquivo' });
  }

};
