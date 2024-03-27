require('dotenv').config()
const fs = require('fs');
const path = require('path');
const servidorPath = process.env.SERVIDORPATH
const ItModel = require('../../models/Its');
const ItsDepartmentsViewersModel = require('../../models/ITsVisualizadores');
const ItsDepartmentsOwnersModel = require('../../models/ITsElaboradores');
const DepartmentsModel = require('../../models/Departamentos');
const UserModels = require('../../models/Usuarios');
const { sendEmailIT } = require('../functions/sendEmail');

//SALVAR NOVA IT NO BANCO
exports.sgiItCreate = async (req, res) => {
  let it;

  const { nome, statuses, user } = req.body;
  const nomeArquivo = nome  + ".pdf"

  try {
    //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
    const novaIt = {
      itName: nomeArquivo,
      createdBy: user,
      updatedBy: user
    };

    //INSERE OS VALORES NO BANCO DE DADOS
    await ItModel.create(novaIt);

    //BUSCA O ID DA NOVA IT PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
    it = await ItModel.findOne({
      where: { itName: nomeArquivo },
      attributes: ['idIt'],
      raw: true,
      nest: true,
    });

    // Obtém os departamentos com 'V' do objeto statuses
    const departamentosV = Object.keys(statuses)
      .map((idDept) => parseInt(idDept, 10)) // ou +idDept para converter para inteiro
      .filter((idDept) => statuses[idDept] === 'V');

    // Obtém os departamentos com 'V' do objeto statuses
      const departamentosD = Object.keys(statuses)
      .map((idDept) => parseInt(idDept, 10)) // ou +idDept para converter para inteiro
      .filter((idDept) => statuses[idDept] === 'D');

      //combina os dois arrays em um só
      const combinedArray = [...departamentosV, ...departamentosD];
      
    //cria relacionamentos da tabela Viewer
    for (const idDept of departamentosV) {
      try {
        await ItsDepartmentsViewersModel.create({
          idIt: it.idIt,
          idDept,
        });
        console.log('Registro criado com sucesso.');
      } catch (error) {
        console.error('Erro ao criar registro:', error);
      };
    };

    //cria relacionamentos da tabela Ownwer
    for (const idDept of departamentosD) {
      try {
        await ItsDepartmentsOwnersModel.create({
          idIt: it.idIt,
          idDept,
        });
        console.log('Registro criado com sucesso.');
      } catch (error) {
        console.error('Erro ao criar registro:', error);
      };
    };

    const registrosCombinados = [];
    const tipo = 'novaIT';

      //busca os usuários e emails dos departamentos relacionados acima
      const fetchAndCombineRecords = async () => {
        for (const idDept of combinedArray) {
          try {
            const users = await UserModels.findAll({
              where: { idDept, sendEmail: 'S' },
              attributes: ['nameComplete', 'email'],
              raw: true,
              nest: true,
            });

            // Adicione os registros ao array combinado
            registrosCombinados.push(...users);

          } catch (error) {
            console.error(`Erro ao buscar registros para idDept ${idDept}:`, error);
          };
        };
      };

      try {
        // Chame a função que combina os registros de todos que recebem email
        await fetchAndCombineRecords();
    
        // Envie e-mails para novas ITs
        sendEmailIT(registrosCombinados, nome, tipo);

      } catch (error) {
        console.error('Erro ao enviar e-mails:', error);
      }

      msg = 'IT criada com sucesso';
      msg_type = 'success';
  } catch (error) {
      console.error('Erro:', error);
      msg = 'Houve um erro interno.';
      msg_type = 'error';
  };

  return res.json({ msg, msg_type });
};


//VERIFICA SE JÁ EXISTE A IT NO BANCO
exports.sgiItSearch = async (req, res) => {

  const { nome, it } = req.body;
  const nomeArquivo = nome  + ".pdf"

  if(nome){ //entra aqui se existir um nome para buscar
    
    try {

      //BUSCA O ID DA NOVA IT PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
      const resultado = await ItModel.findOne({
        where: { itName: nomeArquivo },
        attributes: ['idIt'],
        raw: true,
        nest: true,
      });
  
      const itExists = resultado ? true : false;
      
      return res.json({ itExists });
  
    } catch (error) {
        console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
    };

  } else { //entra aqui se existir uma ID para buscar

    try {
      
      //BUSCA O ID DA NOVA IT PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
      const itName = await ItModel.findOne({
        where: { idIt: it },
        attributes: ['itName'],
        raw: true,
        nest: true,
      });

      //BUSCA O ID DA NOVA IT PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
      const itOwner = await ItsDepartmentsOwnersModel.findAll({
        where: { idIt: it },
        attributes: ['idDept'],
        raw: true,
        nest: true,
      });

      //BUSCA O ID DA NOVA IT PARA USAR NA TABELA DE RELACIONAMENTO COM OS DEPARTAMENTOS
      const itViewer = await ItsDepartmentsViewersModel.findAll({
        where: { idIt: it },
        attributes: ['idDept'],
        raw: true,
        nest: true,
      });

      return res.json({ itName, itOwner, itViewer});
  
    } catch (error) {
        console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
    };
  };
};


//LISTA TODAS AS ITS ************************************************************************************************************
exports.sgiItList = async (req, res) => {

  try {
      const allIts = await ItsDepartmentsOwnersModel.findAll({
      attributes: ['idIt', 'idDept'],
      include: [{
          model: ItModel,
          attributes: ['itName'],
      },
      {
        model: DepartmentsModel,
        attributes: ['department'],

      }],
      raw: true,
      nest: true,
      });

      return res.json({ allIts });
      
  } catch (error) {
      console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  };
};


//DELETA A IT ************************************************************************************************************
exports.sgiItsDelete = async (req, res) => {

  const { idIt, itName, user } = req.body;

  try {
    // PRIMEIRO APAGA OS RELACIONAMENTOS DA IT COM A TABELA VIEWER
    await ItsDepartmentsViewersModel.destroy({
      where: {
        idIt,
      },
    });
  
    // APAGA OS RELACIONAMENTOS DA IT COM A TABELA OWNER
    await ItsDepartmentsOwnersModel.destroy({
      where: {
        idIt,
      },
    });
  
    // APAGA A IT DA TABELA ITS
    await ItModel.destroy({
      where: {
        idIt,
      },
    }); 
  
    msg = "IT excluída com sucesso";
    msg_type = "success";
  } catch (err) {
    console.error("Erro interno:", err);
    msg = "Houve um erro interno.";
    msg_type = "error";
  }

  const now = new Date();
  const pastaOrigem = `/var/www/${servidorPath}/public/sharedFiles/sgi/its`;
  const subpastaDesativados = 'Desativados';
  const nomeArquivo = itName; // Substitua pelo nome real do arquivo
  const sufixo = `_DEL_${now.toISOString()}_${user}`;
  
  const caminhoOriginal = path.join(pastaOrigem, nomeArquivo);
  const caminhoDestino = path.join(pastaOrigem, subpastaDesativados, nomeArquivo + sufixo );
  
  // Verifica se o arquivo existe antes de tentar movê-lo
  if (fs.existsSync(caminhoOriginal)) {
    fs.rename(caminhoOriginal, caminhoDestino, (err) => {
      if (err) {
        console.error('Erro ao mover o arquivo:', err);
      } else {
        console.log('Arquivo movido para a subpasta "Desativados" com sucesso!');
      }
    });
  } else {
    console.error('Arquivo não encontrado:', caminhoOriginal);
  }

  return res.json({ msg, msg_type });
};


//EDITA IT NO BANCO
exports.sgiItUpdate = async (req, res) => {

  const { it, nome, statuses, user, nameChanged, statusChanged } = req.body;
  const idIt = it;
  const nomeArquivo = nome  + ".pdf"

  try {
    //SE O NOME MUDOU ALTERA NO BD
    if(nameChanged) { 
      //COLOCA OS VALORES QUE VEM DO FRONT EM UMA VARIÁVEL
      const novaIt = {
        itName: nomeArquivo,
        updatedBy: user
      };

      //ATUALIZA OS VALORES NO BANCO DE DADOS
      await ItModel.update(novaIt, {
        where: {
          idIt
        }}
      );
    };

    //SE O NOME MUDOU ALTERA NO BD
    if(statusChanged) { 
      // PRIMEIRO APAGA OS RELACIONAMENTOS DA IT COM A TABELA VIEWER
      await ItsDepartmentsViewersModel.destroy({
        where: {
          idIt,
        },
      });

      // APAGA OS RELACIONAMENTOS DA IT COM A TABELA OWNER
      await ItsDepartmentsOwnersModel.destroy({
        where: {
          idIt,
        },
      });
    };

    // Obtém os departamentos com 'V' do objeto statuses
      const departamentosV = Object.keys(statuses)
        .map((idDept) => parseInt(idDept, 10)) // ou +idDept para converter para inteiro
        .filter((idDept) => statuses[idDept] === 'V');

    // Obtém os departamentos com 'V' do objeto statuses
      const departamentosD = Object.keys(statuses)
      .map((idDept) => parseInt(idDept, 10)) // ou +idDept para converter para inteiro
      .filter((idDept) => statuses[idDept] === 'D');

    //combina os dois arrays em um só
    const combinedArray = [...departamentosV, ...departamentosD];

    if(statusChanged) { 
      //cria relacionamentos da tabela Viewer
        for (const idDept of departamentosV) {
          try {
            await ItsDepartmentsViewersModel.create({
              idIt,
              idDept,
            });
            console.log('Registro criado com sucesso.');
          } catch (error) {
            console.error('Erro ao criar registro:', error);
          };
        }; 

        //cria relacionamentos da tabela Ownwer
        for (const idDept of departamentosD) {
          try {
            await ItsDepartmentsOwnersModel.create({
              idIt,
              idDept,
            });
            console.log('Registro criado com sucesso.');
          } catch (error) {
            console.error('Erro ao criar registro:', error);
          };
        };
      };

    const registrosCombinados = [];
    const tipo = 'ITalterada';

    //busca os usuários e emails dos departamentos relacionados acima
    const fetchAndCombineRecords = async () => {
      for (const idDept of combinedArray) {
        try {
          const users = await UserModels.findAll({
            where: { idDept, sendEmail: 'S' },
            attributes: ['nameComplete', 'email'],
            raw: true,
            nest: true,
          });

          // Adicione os registros ao array combinado
          registrosCombinados.push(...users);

        } catch (error) {
          console.error(`Erro ao buscar registros para idDept ${idDept}:`, error);
        };
      }; 
    };

/*     try { */
      // Chame a função que combina os registros de todos que recebem email
/*       await fetchAndCombineRecords(); */
  
      // Envie e-mails para novas ITs
/*       sendEmailIT(registrosCombinados, nome, tipo); 
  
    } catch (error) {
      console.error('Erro ao enviar e-mails:', error);
    } */

    msg = 'IT alterada com sucesso';
    msg_type = 'success';
  } catch (error) {
      console.error('Erro:', error);
      msg = 'Houve um erro interno.';
      msg_type = 'error';
  };

  return res.json({ msg, msg_type });
};


