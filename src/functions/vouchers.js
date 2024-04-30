const fs = require('fs');
const path = require('path');

function vouchers(numero) {

  console.log(numero)

  const pasta = './public/sharedFiles/vouchers';

  return new Promise((resolve, reject) => {
    // Listar os arquivos no diretório
    fs.readdir(pasta, (err, files) => {
      if (err) {
        reject('Erro ao listar os arquivos: ' + err);
        return;
      }

      // Filtrar os arquivos pelo número no nome
      const arquivoFiltrado = files.find(file => file.includes(numero));
      console.log('arquivoFiltrado', arquivoFiltrado)

      if (!arquivoFiltrado) {
        // Se o arquivo não for encontrado, resolve com quantidade 0 e valores vazios
        resolve({ quantidade: 0, voucher: 'NULL' });
        return;
      }

      // Caminho completo para o arquivo
      const caminhoArquivo = '/var/www/backend/public/sharedFiles/vouchers/' + arquivoFiltrado;

      // Ler o conteúdo do arquivo
      fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        if (err) {
          reject('Erro ao ler o arquivo: ' + err);
          return;
        }

        // Utilizando expressão regular para encontrar valores entre aspas
        const valoresEntreAspas = data.match(/"([^"]*)"/g);
        console.log(valoresEntreAspas)

        if (!valoresEntreAspas) {
          // Se não houver valores entre aspas, resolve com quantidade 0 e valores vazios
          resolve({ quantidade: 0, voucher: 'NULL' });
          return;
        }

        // Remover as aspas duplas de cada valor
        const valoresSemAspas = valoresEntreAspas.map(valor => valor.replace(/["' ]/g, ''));

        // Salvar o primeiro valor
        const primeiroValor = valoresSemAspas[0];

        // Remover o primeiro valor da lista
        valoresSemAspas.shift();

        // Adicionar aspas novamente aos valores atualizados
        const valoresAtualizadosComAspas = valoresSemAspas.map(valor => `"${valor}"`);

        // Contar os itens entre aspas
        const quantidadeItens = (valoresAtualizadosComAspas.length) + 1 ;

        // Montar o conteúdo atualizado
        const conteudoAtualizado = valoresAtualizadosComAspas.join('\n');

        // Escrever os dados atualizados no arquivo
        fs.writeFile(caminhoArquivo, conteudoAtualizado, 'utf8', (err) => {
          if (err) {
            reject('Erro ao escrever no arquivo: ' + err);
            return;
          }

          // Resolve a Promise com a quantidade, o primeiro valor e a lista atualizada
          resolve({ quantidade: quantidadeItens, voucher: primeiroValor });
        });
      });
    });
  });
}

module.exports = {
  vouchers,
};

