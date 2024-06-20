//modulo para manipulação de formatos de nuemro

function converterParaInteiro(numero) {
  // Remove o ponto e converte para inteiro
  const numeroInteiro = parseInt(numero.toString().replace('.', ''), 10);

  return numeroInteiro;
}
  
  
  
module.exports = {converterParaInteiro};