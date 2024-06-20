//modulo para manipulação de formatos de horas

function converterHora(horaFormatoHHMM) {

  // Adiciona ":00" ao final da string
  return horaFormatoHHMM + ":00";
}
  
  
  
module.exports = {converterHora};