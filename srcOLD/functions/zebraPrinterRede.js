const net = require('net');

function zebraPrinterRede(data, qtidade, ip) {

    return new Promise((resolve, reject) => {

      const ipAddress = ip;
      const port = 9100; // Porta TCP para comunicação com a impressora
      const zplData = data;
      const qtdade = qtidade;

      console.log('Conectando à impressora...');
      const client = new net.Socket();
  
      client.connect(port, ipAddress, () => {
        console.log('Conexão bem-sucedida! Enviando dados para impressão...');
        for (let i = 0; i < qtdade; i++) {
         client.write(zplData);
        }
        client.end();
      });
  
      client.on('error', (err) => {
        console.error('Erro ao conectar com a impressora:', err);
        reject(false);
      });
  
      client.on('close', () => {
        console.log('Conexão com a impressora encerrada ...');
        resolve(true);
      });
    });
};

module.exports = zebraPrinterRede;
