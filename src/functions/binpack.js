const binPack = require('bin-pack');

function binpack() {

    
        // Defina as dimensões do contêiner
        const container = { width: 10, height: 10, depth: 10 };

        // Defina as dimensões dos objetos a serem empacotados
        const items = [
        { width: 2, height: 2, depth: 2 },
        { width: 3, height: 3, depth: 3 },
        // ... adicione mais objetos conforme necessário
        ];

        // Execute o algoritmo de empacotamento
        const result = binPack(items, container);

        // Exiba o resultado
        console.log(result);

        return '';

  }
  
  
  
module.exports = 
{
    binpack
};