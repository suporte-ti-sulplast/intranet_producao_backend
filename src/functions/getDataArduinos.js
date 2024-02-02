const fs = require('fs');
const { getSensorDataRackSalaTI } = require('../conections/arduino');
const { DateTime } = require('luxon');

async function monitorSensorDataRackSalaTI(seg) {
  try {
    const intervalInSeconds = seg;

    const fetchData = async () => {
      try {
        const sensorData = await getSensorDataRackSalaTI();

        // Lê o conteúdo atual do arquivo, se existir
        let existingData = [];
        const filePath = 'public/sensorRackSalaTI.json';

        if (fs.existsSync(filePath)) {
          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            existingData = JSON.parse(fileContent);

            if (!Array.isArray(existingData)) {
              throw new Error('O conteúdo do arquivo não é um array JSON.');
            }
          } catch (parseError) {
            throw new Error(`Erro ao analisar JSON do arquivo: ${parseError.message}`);
          }
        }

        // Adiciona a data/hora à estrutura de dados no fuso horário de Brasília
        const dataWithTimestamp = {
          timestamp: DateTime.now().setZone('America/Sao_Paulo').toISO(),
          sensorData,
        };

        // Adiciona os novos dados ao array existente
        existingData.push(dataWithTimestamp);

        // Converte o array atualizado para JSON
        const jsonData = JSON.stringify(existingData, null, 2);

        // Escreve os dados atualizados de volta no arquivo
        fs.writeFileSync(filePath, jsonData);

      } catch (error) {
        console.error('Erro ao obter dados do sensor:', error.message);
      }
    };

    // Executa a função fetchData a cada intervalInSeconds segundos
    setInterval(fetchData, intervalInSeconds * 1000);

    // Execute fetchData pela primeira vez sem esperar pelo intervalo inicial
    await fetchData();
  } catch (error) {
    console.error('Erro na execução periódica:', error.message);
  }
}

module.exports = {
  monitorSensorDataRackSalaTI,
};
