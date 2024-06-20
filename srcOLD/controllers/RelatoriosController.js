const dbDelsoft = require('../conections/dbDelsoft');
const CentroCustosModel = require('../../models/CentroCustos');
const RelatorioKlProduzidoExtrusorasModel = require('../../models/RelatorioKlProduzidoExtrusoras');
const RelatorioEvolucaoCustoPorDeptosModel = require('../../models/RelatorioEvolucaoCustoPorDeptos');
const { where } = require('sequelize');

//PESQUISA NO DELSOFT TESTE ************************************************************************************************************
exports.consultaFechamentoEstoque = async (req, res) => {

 const dataParametro = req.body.data; // Defina a data desejada aqui

   const resultadoConsulta = await dbDelsoft.query(
     'SELECT * FROM REL_Fechamento_Estoque_Mensal(:data)',
     {
       replacements: { data: dataParametro }, // Substitua pela sua data desejada
       type: dbDelsoft.QueryTypes.SELECT,
     }
   );
   
   return res.json({ resultadoConsulta });
};


//PESQUISA NO DELSOFT TESTE ************************************************************************************************************
exports.evolucaoCustoPorDepto = async (req, res) => {

  const { mes, ano } = req.body;

  const cc = [101001, 101002,  101003, 101005, 102001, 102002, 103001, 103002, 105001];

  // Primeiro dia do mês
  const primeiroDia = new Date(ano, mes - 1, 1);
  // Último dia do mês
  const ultimoDia = new Date(ano, mes, 0);
  let fechamento = false 
  let dataExist = false 

  // Extrair o ano e o mês
  const year = parseInt(ano);
  const month = parseInt(mes);

  try {

    const dados  = await RelatorioEvolucaoCustoPorDeptosModel.findOne({
      where: {
        year: ano,
        month: mes
      }
    });

    if(dados) {
      dataExist = true;
    };

    //FUNÇÃO QUE BUSCA NO BD INTRANET O KILO PRODUZIDO DA EXTRUSORA
    const kProduzido = await RelatorioKlProduzidoExtrusorasModel.findAll({
      attributes: ['year','month','kProduced'],
      where: {
        year,
        month
      },
      raw: true,
      nest: true,
    }); 

    //FUNÇÃO QUE BUSCA NO DELSOFT SE O MÊS JÁ ESTÁ FECHADO
    try {
      const verificarFechamento = await dbDelsoft.query(
        'SELECT dbo.UTILS_VerificarFechamento(:DataParam );',
          {
              replacements: { 
                DataParam: ultimoDia
              },
              type: dbDelsoft.QueryTypes.SELECT,
          }
      );

      if (verificarFechamento.length > 0) {
        fechamento = true;
      } else {
        fechamento = false;
      };
    } catch (error) {
      console.log("Houve um erro interno", error);
    };

    //função que busca o preço da hora para cada centro de cus
    async function buscarCustoHoraPorCC() {
      const resultados = []; // Array para armazenar os resultados

      //para cada idCostCenter de CC le busca no delsoft
      for (const idCostCenter of cc) {

          const custoHoraPorCCDelSoft = await dbDelsoft.query(
            'SELECT * FROM UTILS_CentroCustoValorHora(:Codigo)',
              {
                  replacements: { 
                      Codigo: idCostCenter, 
                  },
                  type: dbDelsoft.QueryTypes.SELECT,
              }
          );

          let linhaEncontrada = null;
          let linhaEncontradaPrev = null;

          // Percorre o objeto custoHoraPorCCDelSoft
          Object.values(custoHoraPorCCDelSoft).forEach(item => {
            let dataObjeto = new Date(item.CUS_CentroCustoData);
            linhaEncontrada = item
            // Verifica se a data do objeto é menor ou igual à data passada por parâmetro
            if (dataObjeto <= primeiroDia) {
              // Atualiza a linha encontrada
              linhaEncontradaPrev = linhaEncontrada; // Índice + 1 para obter o número da linha começando de 1
            } else {
              // Se a data do objeto for maior que a data passada por parâmetro, encerra o loop
              return;
            }

          });
          resultados.push({
            codigoCC: linhaEncontradaPrev.CUS_CentroCustoCodigo,
            valorHoraCC: linhaEncontradaPrev.CUS_CentroCustoValorHora
          });


    }  
      // Retorna o array de resultados
      return resultados;
  }

  const custoHoraPorCC = await buscarCustoHoraPorCC();

  const retorno = await dbDelsoft.query(
    'SELECT * FROM dbo.REL_EvolucaoCustoPorDepto(:dataIni,:dataFin) ORDER BY Centro_custo_código ASC;',
      {
          replacements: { 
              dataIni: primeiroDia, 
              dataFin: ultimoDia
          },
          type: dbDelsoft.QueryTypes.SELECT,
      }
  );

  //filtra do retorno da consulta DESLSOFT apenas o que vai usar no relatório
  const resultado = retorno.filter(item => 
    item['Centro_custo_descrição'] === 'EXTRUSAO' ||
    item['Centro_custo_descrição'] === 'MOLDAGEM' ||
    item['Centro_custo_descrição'] === 'ACABAMENTO TP' ||
    item['Centro_custo_descrição'] === 'ROBO DE CORTE' ||
    item['Centro_custo_descrição'] === 'LAMINAÇÃO' ||
    item['Centro_custo_descrição'] === 'ACABAMENTO FV' ||
    item['Centro_custo_descrição'] === 'ROTOMOLDAGEM' ||
    item['Centro_custo_descrição'] === 'ACABAMENTO RT' ||
    item['Centro_custo_descrição'] === 'PINTURA'
  );

  return res.json({ resultado, kProduzido, custoHoraPorCC, fechamento, dataExist });

  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  };

 };


//ADICIONA OS DADOS NO NOSSO BANCO INTRANET ************************************************************************************************************
exports.evolucaoCustoPorDeptoAdicionar = async (req, res) => {

  const { dados, mes, ano, dataExist } = req.body;

  console.log(mes, ano, dataExist)

  // Array para armazenar as linhas geradas
  const linhas = [];

  // Itera sobre cada item no array de dados
  dados.forEach(item => {
    const linha = {
      year: ano,
      month: mes,
      idCC: item.Centro_custo_código,
      nameCostCenter: item.Centro_custo_descrição,
      productionHour: item.Hora_Produção,
      productionMinute: item.Hora_Produção !== null ? (item.Hora_Produção * 60).toFixed(2) : null,
      proratedCost: item.Custo_Rateado !== null ? item.Custo_Rateado : 0,
      minuteCost: item.Custo_Rateado !== null ? ((item.Custo_Rateado) / (item.Hora_Produção * 60)).toFixed(2) : 0,
      percentual: (((item.Custo_Rateado / item.Hora_Produção * 60 / item.valorHoraCC / 60) - 1) * 100).toFixed(2),
      kProduced: item.kProduzido !== null ? item.kProduzido : 0,
      kPrice: item.kProduzido !== null && item.kProduzido !== 0 && item.Custo_Rateado !== null ? ((item.Custo_Rateado) / item.kProduzido).toFixed(2) : 0,
      costHour: item.valorHoraCC !== null ? item.valorHoraCC.toFixed(2) : 0
    };

    linhas.push(linha);
  })

  if(dataExist) {

    console.log('dados existem entrou no atualizar')

    // Execute a operação DELETE
    RelatorioEvolucaoCustoPorDeptosModel.destroy({
      where: {
        year: ano,
        month: mes
      }
    })
    .then(numDeletedRows => {
      console.log(`Foram excluídas ${numDeletedRows} linhas.`);
    })
    .catch(err => {
      console.error('Erro ao excluir:', err);
    });

    //ATUALIZA A TABELA COM O NOVO VALOR
    await RelatorioEvolucaoCustoPorDeptosModel.bulkCreate(linhas).then(() => {

      console.log("Dados adiconados com sucesso");
      msg = "Dados adiconados com sucesso";
      msg_type = "success";
      return res.json({ msg, msg_type });

    }).catch((err) => {
        console.log("erro", err);
        msg = "Houve um erro interno.";
        msg_type = "error";
        return res.json({ msg, msg_type });
    });
  }  else {
    console.log('dados existem entrou no atualizar')
    //ATUALIZA A TABELA COM O NOVO VALOR
    await RelatorioEvolucaoCustoPorDeptosModel.bulkCreate(linhas).then(() => {

      console.log("Dados adiconados com sucesso");
      msg = "Dados adiconados com sucesso";
      msg_type = "success";
      return res.json({ msg, msg_type });

    }).catch((err) => {
        console.log("erro", err);
        msg = "Houve um erro interno.";
        msg_type = "error";
        return res.json({ msg, msg_type });
    });
  }
 };


//VERIFICA SE JÁ TEM OS DADOS NO NOSSO BANCO INTRANET ************************************************************************************************************
exports.evolucaoCustoPorDeptoBuscar = async (req, res) => {

  const { mes, ano } = req.body;

    //ATUALIZA A TABELA COM O NOVO VALOR
    await RelatorioEvolucaoCustoPorDeptosModel.findOne({
      where: {
        year: ano,
        month: mes
      }
    }).then((registroEncontrado) => {

      // Se um registro correspondente for encontrado
      if (registroEncontrado) {
        msg = "Dados já existem no banco de dados.";
        msg_type = "error";
        return res.json({ msg, msg_type });

      } else {
        msg = "Dados ainda não existem";
        msg_type = "success";
        return res.json({ msg, msg_type });
      }

  }).catch((err) => {
      console.log("erro", err);
      msg = "Houve um erro interno.";
      msg_type = "error";
      return res.json({ msg, msg_type });
  }) ;
 };


//VERIFICA SE JÁ TEM OS DADOS NO NOSSO BANCO INTRANET ************************************************************************************************************
exports.evolucaoCustoPorDeptoListar = async (req, res) => {

  try {

        const centrCusto = await CentroCustosModel.findAll();

        const resultado = await RelatorioEvolucaoCustoPorDeptosModel.findAll({
          include: [{
              model: CentroCustosModel,
              attributes: ['idCC','nameCostCenter'],
              as: 'centroCusto'
          }],
          raw: true,
          nest: true,
      });

      return res.json({ resultado, centrCusto });

  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  }

 };

 //VERIFICA SE JÁ TEM OS DADOS NO NOSSO BANCO INTRANET ************************************************************************************************************
exports.centroCustoListar = async (req, res) => {

  try {
      const centroCusto = await CentroCustosModel.findAll();
      return res.json({ centroCusto });

  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  }

 };