const { exec } = require('child_process');
require('dotenv').config();

function zebraPrinterLocal(data, qtidade, nomeImpressora, ip) {

  let usuario, senha;

  if(nomeImpressora === 'ZBR09') {
    usuario = process.env.ZBR09_USER;
    senha = process.env.ZBR09_PWD;
  } else {
    usuario = process.env.ZBR_USER;
    senha = process.env.ZBR_PWD;
  };


  return new Promise((resolve, reject) => {
    const comandoImpressao = `echo "${data}" | smbclient //${ip}/${nomeImpressora} -U ${usuario}%${senha} -c 'print -'`;

    // Imprimir múltiplas vezes com base na quantidade desejada
    for (let i = 0; i < qtidade; i++) {
      exec(comandoImpressao, (erro, stdout, stderr) => {
        if (erro) {
          console.error(`Erro ao imprimir: ${stderr}`);
          reject(false);
        } else {
          if (i === qtidade - 1) {
            // Se for a última iteração, resolve a promessa
            resolve(true);
          };
        };
      });
    }
  });
}

module.exports = zebraPrinterLocal;
