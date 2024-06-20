const moment = require('moment');

//listar os próximos 6 dias a partir de uma data fornecida
function listarProximosDias(dataISO) {
    const dias = [];
    const dataFormatada = moment(dataISO).format('DD/MM');

    for (let i = 0; i < 7; i++) {
        const proximoDia = moment(dataFormatada, 'DD/MM').add(i, 'days').format('DD/MM');
        dias.push(proximoDia);
    }

    return dias;
}

module.exports = { listarProximosDias };