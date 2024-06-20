const dbDelsoft = require('../conections/dbDelsoft');
const CentroCustosModel = require('../../models/CentroCustos');
const RelatorioKlProduzidoExtrusorasModel = require('../../models/RelatorioKlProduzidoExtrusoras');
const RelatorioEvolucaoCustoPorDeptosModel = require('../../models/RelatorioEvolucaoCustoPorDeptos');
/* const CalculoCustoProdutosItensModel = require('../../models/CalculoCustoProdutosItens');
const CalculoCustoProdutosModel = require('../../models/CalculoCustoProdutos');
const UserModel = require('../../models/Usuarios');
const Sequelize = require('sequelize');
const { where } = require('sequelize'); */

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
    'SELECT * FROM REL_EvolucaoCustoPorDepto(:dataIni,:dataFin) ORDER BY Centro_custo_código ASC;',
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

 //VERIFICA SE JÁ TEM OS DADOS NO NOSSO BANCO INTRANET ************************************************************************************************************
/*  exports.custoProdutoGerar = async (req, res) => {

  const { mes, ano, data, idUser }  = req.body;
  console.log( mes, ano, data, idUser )


  try {
    //busca o ulimo indice da tabela CalculoCustoProdutos
    const lastIndex = await CalculoCustoProdutosModel.findOne({
      attributes:['idCCP'],
      order: [['idCCP', 'DESC']]
    }); 

    const nextIndex = (parseInt(lastIndex.idCCP) + 1);
    console.log(nextIndex);

    const produtos_produzidos = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_ProdutosProduzidos ();',
        {
          type: dbDelsoft.QueryTypes.SELECT,
        }
    );

    // Convertendo os resultados para um formato adequado, se necessário
    const produtosProduzidosArray = produtos_produzidos.map(produto => ({
      calculo_custo_id: nextIndex,
      codigo: produto.codigo,
      descricao: produto.descricao,
    }));

    // Array para armazenar os chunks
    const chunksArray = [];

    // Dividindo os dados em chunks (lotes) de 200 elementos
    const chunkSize = 200;
    for (let i = 0; i < produtosProduzidosArray.length; i += chunkSize) {
      const chunk = produtosProduzidosArray.slice(i, i + chunkSize);

      // Armazenando cada chunk na array
      chunksArray.push(chunk);
    }

    // Agora `chunksArray` contém todos os chunks e pode ser usado posteriormente


    // Você pode utilizar `chunksArray` como desejar a partir daqui
    // Por exemplo, para inserir cada chunk em uma tabela mais tarde
      for (const chunk of chunksArray) {
        await CalculoCustoProdutosItensModel.bulkCreate(chunk).then(() => {
          console.log("Dados adiconados com sucesso");
        }).catch((err) => {
          console.log("Houve um erro interno", err);
          return res.status(500).json({ error: "Internal server error." });
        });
      }

    //buscar todos os itens não calculdos na tabela CalculoCustoProdutosItensModel para realizar os calculos
    const registros =  await CalculoCustoProdutosItensModel.findAll({
      where: {
        calculado: 0
      }
    });

    // Inicializa um objeto para receber os valores
    const contexto = {
      custo_item_atual: 0,
      quantidade_atividade: [],
      custo_item_atual_mo: [],
      custo_item_atual_i: [],
      custos: {}
    };

    // Para cada registro encontrado, chama a função que realiza os cálculos
    for (const registro of registros) {
    const codigo = registro.codigo.trim(); // Remove espaços em branco do início e do fim da string

    const resposta = await RealizarCalculos(registro, 1, contexto);

    contexto.custos[codigo] = contexto.custo_item_atual; // Salva o custo calculado para o produto atual no objeto custos
    }

    //busca novamente o dados já atualizados para pegar o resultado da quantidade de itens e a sma do valor
    const resp =  await CalculoCustoProdutosItensModel.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('custo')), 'total_valor'],
        [Sequelize.fn('COUNT', Sequelize.col('valor_item')), 'quantidade_itens']
      ],
      where: {
        calculo_custo_id: 141
      }
    });

    // Verificar se resp não está vazio e acessar o primeiro elemento
    if (resp.length > 0) {
    
      const dados = {
        reference_date: data,
        createdBy: parseInt(idUser),
        total: resp[0].total_valor,
        countItens: resp[0].quantidade_itens
      };

      console.log(dados);
    } else {
      console.log("Nenhum resultado encontrado.");
    }

    // Função que realiza os cálculos
    async function RealizarCalculos(registro, multiplicador = 1, contexto) {
      const codigo = registro.codigo;
      const setupResult = await resgatarSetup(codigo);

      if (!contexto[codigo]) {
        contexto[codigo] = {
          codigo: codigo,
          descricao: registro.descricao,
          setup: setupResult,
          filhos: [],
          quantidade_atividade: 0,
          total_atividade: 0,
          total_item: 0,
          total: 0,
          atividades: {}
        };
      }

    // Resgata as atividades
    const atividades = await resgatarAtividades(codigo);

    for (const atividade of atividades) {
      const atividadeCodigo = atividade.atividade_codigo;
      const valorMinuto = atividade.custo / 60;
      const quantidade = atividade.tempo_minutos * atividade.operador_quantidade;
      const valorTotal = valorMinuto * quantidade;

      contexto[codigo].atividades[atividadeCodigo] = {
        codigo: atividadeCodigo,
        operadores: atividade.operador_quantidade,
        quantidade: quantidade,
        valor: valorMinuto,
        valor_total: valorTotal
      };

      // Atualiza os valores no contexto
      contexto[codigo].quantidade_atividade += quantidade;
      contexto[codigo].total_atividade += valorTotal;
      contexto[codigo].total += valorTotal;
    }

    const itens = await resgatarItens(codigo);

    for (const item of itens) {
      const filhos = await verificarFilhos(item.codigo);

      if (filhos.length === 0) {
        const codigoItem = item.codigo;
        const custo = await resgatarCusto(item.codigo);
        const quantidade = item.quantidade;
        const valorTotal = custo * quantidade;

        if (!contexto[codigo].itens) {
          contexto[codigo].itens = {};
        }

        contexto[codigo].itens[codigoItem] = {
          codigo: codigoItem,
          quantidade: quantidade,
          valor: item.sobra === 'R' ? -custo : custo,
          valor_total: item.sobra === 'R' ? -valorTotal : valorTotal
        };

        contexto[codigo].total_item += contexto[codigo].itens[codigoItem].valor_total;
        contexto[codigo].total += contexto[codigo].itens[codigoItem].valor_total;

      } else {
        console.log("TEM FILHOS ENTROU NA RECURSIVIDADE");
        await RealizarCalculos(item, item.quantidade, contexto);
      }
    }

    // Atualiza as propriedades do contexto
    contexto.quantidade_atividade.push(contexto[codigo].quantidade_atividade);
    contexto.custo_item_atual_mo.push(contexto[codigo].total_atividade + contexto[codigo].setup);
    contexto.custo_item_atual_i.push(contexto[codigo].total_item);
    contexto.custo_item_atual += contexto[codigo].total;

     const valorUpdate = {
      custo: contexto[codigo].total, // Verifique se contexto[codigo] está definido
      valor_mao_de_obra: contexto[codigo].total_atividade + contexto[codigo].setup, // Verifique se contexto[codigo] está definido e se o array custo_item_atual_mo possui elementos
      valor_item: contexto[codigo].total_item, // Verifique se contexto[codigo] está definido e se o array custo_item_atual_i possui elementos
      quantidade_mao_de_obra: contexto[codigo].quantidade_atividade, // Verifique se contexto[codigo] está definido e se o array quantidade_atividade possui elementos
      calculado: 1,
      updated_at: new Date()
    }; 

    try {
      await CalculoCustoProdutosItensModel.update(
        valorUpdate,
        {
          where: {
            codigo: codigo,
            calculo_custo_id: nextIndex
          }
        }
      );
      console.log('Dados atualizados com sucesso');
    } catch (error) {
      console.log("Houve um erro interno", error);
      return res.status(500).json({ error: "Internal server error." });
    }
    

    return contexto;
  }
    
    




    //resgatarSetup do banco da Delsoft
    async function resgatarSetup(codigo) {
      const resp = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_ResgatarSetup(:Codigo);',
        {
          replacements: { 
            Codigo: codigo
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
      );
      const setupResult = resp[0];
    
      let calculatedValue = 0;
    
      if (setupResult && setupResult.setup > 0 && setupResult.PRO_FilialQtdProdutividade != 0) {
        calculatedValue = ((setupResult.setup / setupResult.PRO_FilialQtdProdutividade / 60) * setupResult.CUS_CentroCustoValorHora);
      };
      return calculatedValue; //ATÉ AQUI APARENTEMENTE PARECE TUDO CERTO
    }






    //resgatarAtividades do banco da Delsoft
    async function resgatarAtividades(codigo) {
      const resp = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_ResgatarAtividades(:data, :Codigo);',
        {
          replacements: { 
            data: data,
            Codigo: codigo
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
      );
      return resp; //ATÉ AQUI APARENTEMENTE PARECE TUDO CERTO
    }






    //resgatarCusto do banco da Delsoft
    async function resgatarCusto(codigo) {
      const resp = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_ResgatarCusto(:data, :Codigo);',
        {
          replacements: { 
            data: data,
            Codigo: codigo
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
      );
      const respost = (resp.length === 0) ? 0 : resp[0].CUS_ValorProdutoValor;
      return respost;
    }






    //resgatarItens do banco da Delsoft
    async function resgatarItens(codigo) {
      const resp = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_ResgatarItens(:Codigo);',
        {
          replacements: { 
            Codigo: codigo
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
      );
      return resp; //ATÉ AQUI APARENTEMENTE PARECE TUDO CERTO
    }






    //verificarFilhos do banco da Delsoft
    async function verificarFilhos(codigo) {
      const resp = await dbDelsoft.query(
        'SELECT * FROM dbo.REL_VerificarFilhos(:Codigo);',
        {
          replacements: { 
            Codigo: codigo
          },
          type: dbDelsoft.QueryTypes.SELECT,
        }
      );
      return resp; //ATÉ AQUI APARENTEMENTE PARECE TUDO CERTO
    }












  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  }

 }; */


  //LISTA OS RELATORIOS JÁ TIRADOS ************************************************************************************************************
/*  exports.custoProdutoListar = async (req, res) => {

  try {
      const respostas = await CalculoCustoProdutosModel.findAll({
          include: [{
              model: UserModel,
              attributes: ['nameComplete'],
              as: 'createdByUser'
          }],
          raw: true,
          nest: true,
          order: [['idCCP', 'DESC']]
      }); //BUSCAR O USUÁRIO NA TABELA USER 

    return res.json({respostas});

  } catch (error) {
    console.log("Houve um erro interno", error);
    return res.status(500).json({ error: "Internal server error." });
  }

}; */

  //DELETA O RELATORIO TIRADOS ************************************************************************************************************
/*   exports.custoProdutoDeletar = async (req, res) => {

    const{ idCCP } = req.body

    await CalculoCustoProdutosModel.destroy({
      where: {
        idCCP: idCCP
      }
    }).then(() => {
      msg = "Registro excluído com sucesso";
      msg_type = "success";
    }).catch((err) => {
      console.log("erro", err);
      msg = "Houve um erro interno.";
      msg_type = "error";
    });
  
    return res.json({ msg, msg_type });
  
  }; */