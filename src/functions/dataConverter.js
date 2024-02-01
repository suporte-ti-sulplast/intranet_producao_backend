function converterData(data) {
  const partes = data.split('-'); // Divide a data em partes usando o hífen como delimitador
  if (partes.length === 3) {
      const ano = partes[0];
      const mes = partes[1];
      const dia = partes[2];
      return `${dia}/${mes}/${ano}`;
  } else {
      return 'Data inválida';
  }
}



  module.exports = converterData;