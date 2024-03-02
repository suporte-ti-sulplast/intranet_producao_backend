const fs = require('fs');
const path = require('path');
const { getSensorDataRackSalaTI } = require('../conections/arduino');
const cron = require('node-cron');
const { sendEmailTempRackSalaTI } = require('../functions/sendEmail')


async  function sendEmailRackSalaTI(
                                  equipamento,
                                  local,
                                  category,
                                  direcaoMovimento,
                                  estadoAtual,
                                  temperatura,
                                  destinatario,
                                  emailTempAttention,
                                  emailTempModerate,
                                  emailTempHigh,
                                  emailTempDisaster
){

  const envia =
  estadoAtual === 0 ? true :
  estadoAtual === 1 && emailTempAttention === 'S' ? true :
  estadoAtual === 2 && emailTempModerate === 'S' ? true :
  estadoAtual === 3 && emailTempHigh === 'S' ? true :
  estadoAtual === 4 && emailTempDisaster === 'S' ? true :
  false;

  const estado =
  estadoAtual === 0 ? 'NORMAL' :
  estadoAtual === 1 ? 'ATENÇÃO' :
  estadoAtual === 2 ? 'MODERADO' :
  estadoAtual === 3 ? 'ALTO' :
  estadoAtual === 4 ? 'DESASTRE' :
  'Desconhecido'; 

  if(envia) {
    const email = sendEmailTempRackSalaTI(equipamento, local, category, direcaoMovimento, estado, temperatura, destinatario)
    console.log(email)
  } else{
    console.log('Não precisou enviar o email')
  }
};


async function fetchSensorDataRackSalaTI(estadoAtual) {


  let dados;

  let sensorData = {
    sensorDHT11: 0, 
    sensorDS18B20: 0
  };

  let antigoEstado = estadoAtual;
  let novoEstado = 0;

  try {
    sensorData = await getSensorDataRackSalaTI();
  } catch (error) {
    console.error('Erro:', error.message);
  }

  // Pegar o valor mais alto entre sensorDHT11 e sensorDS18B20
  const temperatura = Math.max(sensorData.sensorDHT11, sensorData.sensorDS18B20);

  const filePath = '/var/www/backEnd/public/files/monitorsData.json'; // Caminho absoluto

  try {
      // Lê o conteúdo do arquivo
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Converte o conteúdo para um objeto JavaScript (assumindo que é um arquivo JSON)
      const data = JSON.parse(fileContent);

      // Filtra os dados que correspondem ao idMonitor
      const filteredData = data.filter(item => item.idMonitor === 1);

      // Se há dados correspondentes, pegue o primeiro item do array (ou ajuste conforme necessário)
      dados = filteredData.length > 0 ? filteredData[0] : null;

  } catch (error) {
      console.error('Erro ao ler ou analisar o arquivo JSON:', error);
      // Tratar o erro conforme necessário (por exemplo, retornar uma resposta de erro)
  }

  // Criando um intervalo com base nos dados recebidos
  const range = {
    0: {
      min: -Infinity,
      max: dados.tempAttention
    },
    1: {
      min: dados.tempAttention,
      max: dados.tempModerate
    },
    2: {
      min: dados.tempModerate,
      max: dados.tempHigh
    },
    3: {
      min: dados.tempHigh,
      max: dados.tempDisaster
    },
    4: {
      min: dados.tempDisaster,
      max: +Infinity
    }
  };

  //CONFIGURA O NOVO ESTADO DE ACORDO COM O POSICIONAMENTO NO RANGE
  for (const [state, { min, max }] of Object.entries(range)) {
    if (temperatura >= min && temperatura <= max) {
      novoEstado = parseInt(state,10);
      break;
    }
  }

  //DEVOLVE OS 2 ESTADOS PARA SEREM TRATADOS NA FUNÇÃO DO CRON
  return { novoEstado, antigoEstado, temperatura, dados };
}

async function rackSalaTI(intervaloMinutos) {

    let estadoAtual = 0; //incia com estado mais baixo
    let count = 0;

    //ESTADO
    // 0 => NORMAL
    // 1 => ATENÇÃO
    // 2 => MODERADO
    // 3 => ALTA
    // 4 => DESASTRE

    try {
      // Define uma expressão cron para executar a cada 5 minutos em horas múltiplos de 5
      cron.schedule(`*/${intervaloMinutos} * * * * *`, async () => {
        try {
          const retorno = await fetchSensorDataRackSalaTI(estadoAtual);
          const local = retorno.dados.location;
          const equipamento = retorno.dados.equipament;
          const category = retorno.dados.category;
          const destinatario = retorno.dados.emailReceive;
          const temperatura = retorno.temperatura;
          const emailTempAttention = retorno.dados.emailTempAttention;
          const emailTempModerate = retorno.dados.emailTempModerate;
          const emailTempHigh = retorno.dados.emailTempHigh;
          const emailTempDisaster = retorno.dados.emailTempDisaster;
          

          //COMPARA SE HOUVE ALTERAÇÃO DO ESTADO
          if(retorno.novoEstado !== retorno.antigoEstado) {
            count += 1; //incia um contador de ciclos
            //VERIFICA SE O ESTADO PERMANECEU ALTERADO POR 3 CICLOS - SE PERMANECEU ATUALIZA O ESTADO ATUAL
            if(count === 3){

              //VERIFICA EM QUE SENTIDO A ALTERAÇÃO ESTÁ ACONTENCENDO
              if(retorno.novoEstado > retorno.antigoEstado ){
                direcaoMovimento ='Subiu para o nível:';
              } else {
                direcaoMovimento = 'Voltou para o nível:';
              }
              estadoAtual = retorno.novoEstado //atualizado o estado
              count = 0; //zera o contador
              
              sendEmailRackSalaTI(equipamento,
                                  local,
                                  category,
                                  direcaoMovimento,
                                  estadoAtual,
                                  temperatura,
                                  destinatario,
                                  emailTempAttention,
                                  emailTempModerate,
                                  emailTempHigh,
                                  emailTempDisaster
              )
            };
          } else {
            count = 0;
          }

        } catch (error) {
          console.error('Erro ao obter ', error.message);
        };
      });
  
    } catch (error) {
      console.error('Erro ao agendar a tarefa:', error.message);
    };
  };
  
  module.exports = {
    rackSalaTI,
  };