const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const saveFileAsImage = (file) => {
    console.log(file)

    console.log(fileName)

    if (file) {
      // Obtenha a extensão do arquivo original
      const extensaoArquivo = path.extname(file.name);
  
      // Crie um nome criptografado para o arquivo com a mesma extensão
      const nomeCriptografado = crypto.randomBytes(10).toString('hex');
      const novoNomeArquivo = `${nomeCriptografado}${extensaoArquivo}`;
  
      // Caminho onde você deseja salvar a imagem
      const directory = 'public/newsFileSaved';
      const savePath = path.join(directory, novoNomeArquivo);
  
      // Crie um stream de leitura do arquivo original
      const fileStream = fs.createReadStream(file.path, { highWaterMark: 1024 });
  
      // Crie um stream de escrita para a nova imagem
      const writeStream = fs.createWriteStream(savePath);
  
      // Redirecione os dados do stream de leitura para o stream de escrita
      fileStream.pipe(writeStream);
  
      // Feche o stream de escrita após concluir
      writeStream.on('finish', () => {
        console.log(`Arquivo salvo como ${novoNomeArquivo}`);
      });
    }
  };

  module.exports = saveFileAsImage;