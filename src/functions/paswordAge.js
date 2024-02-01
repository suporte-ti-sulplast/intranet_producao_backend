function calcularDiferencaEmDias(updatedAt) {
    const updatedAtDate = new Date(updatedAt);
    const hoje = new Date();
  
    const diferencaEmTempo = hoje.getTime() - updatedAtDate.getTime();
    const diferencaEmDias = Math.floor(diferencaEmTempo / (1000 * 3600 * 24));
  
    return diferencaEmDias;
  }

  module.exports = calcularDiferencaEmDias;