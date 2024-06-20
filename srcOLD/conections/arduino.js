const axios = require('axios');
require('dotenv').config()


async function getSensorDataRackSalaTI() {
    const ArduinoURL = `http://${process.env.ARDUINO_RACK_SERVIDOR_IP}:${process.env.ARDUINO_RACK_SERVIDOR_PORT}/`;
    try {
        const response = await axios.get(ArduinoURL);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Erro na solicitação. Código de status: ${response.status}`);
        }
    } catch (error) {
/*         throw new Error(`Erro ao fazer a solicitação: ${error.message}`); */
    }
}


async function getSensorDataOutroSensor() {
/*     const ArduinoURL = `http://${process.env.ARDUINO_RACK_SERVIDOR_IP}:${process.env.ARDUINO_RACK_SERVIDOR_PORT}${SensorRoute}/`;
    try {
        const response = await axios.get(ArduinoURL);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Erro na solicitação. Código de status: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Erro ao fazer a solicitação: ${error.message}`);
    } */
}
    
    module.exports = {
        getSensorDataRackSalaTI,
        getSensorDataOutroSensor
    };