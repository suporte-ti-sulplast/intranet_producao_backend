const fs = require('fs');
const { getSensorDataRackSalaTI } = require('../conections/arduino');
const { DateTime } = require('luxon');
const cron = require('node-cron');
const MonitorsModel =  require('../../models/Monitors');


async function fetchSensorDataRackSalaTI(estadoAtual) {

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

  //Busca no banco de dados os valores para montar o range das temperaturas
  const resultado = await MonitorsModel.findOne({
    attributes: ['tempAttention', 'tempModerate', 'tempHigh', 'tempDisaster'],
    where: 1,
    raw: true,
    nest: true,
  });

  // Criando um intervalo com base nos dados recebidos
  const range = {
    0: {
      min: -Infinity,
      max: resultado.tempAttention
    },
    1: {
      min: resultado.tempAttention,
      max: resultado.tempModerate
    },
    2: {
      min: resultado.tempModerate,
      max: resultado.tempHigh
    },
    3: {
      min: resultado.tempHigh,
      max: resultado.tempDisaster
    },
    4: {
      min: resultado.tempDisaster,
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
  return { novoEstado, antigoEstado, temperatura };

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

          //COMPARA SE HOUVE ALTERAÇÃO DO ESTADO
          if(retorno.novoEstado !== retorno.antigoEstado) {
            console.log(retorno.antigoEstado, retorno.novoEstado, retorno.temperatura);
            console.log('HOUVE ALTERAÇÃO DO ESTADO');
            count += 1; //incia um contador de ciclos
            //VERIFICA SE O ESTADO PERMANECEU ALTERADO POR 3 CICLOS - SE PERMANECEU ATUALIZA O ESTADO ATUAL
            if(count === 3){

              //VERIFICA EM QUE SENTIDO A ALTERAÇÃO ESTÁ ACONTENCENDO
              if(retorno.novoEstado > retorno.antigoEstado ){
                direcaoMovimento ='subindo';
              } else {
                direcaoMovimento = 'descendo';
              }
              estadoAtual = retorno.novoEstado //atualizado o estado
              count = 0; //zera o contador
              
              console.log(`ATUALIZADO O ESTADO ATUAL PARA ${retorno.novoEstado}, ${direcaoMovimento}, ZERADO O CONTADOR`);
              console.log('AQUI ENVIA O EMIAL');

            };
            console.log(count);
          } else {
            console.log(retorno.antigoEstado, retorno.novoEstado, retorno.temperatura);
            console.log('ESTADO PERMANECEU O MESMO');
            count = 0;
            console.log(count);
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