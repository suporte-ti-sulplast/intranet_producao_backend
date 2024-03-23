// ldapFunctions.js
require('dotenv').config();
const ldap = require('ldapjs');
const fs = require('fs');

function buscarUsuarios() {
    return new Promise((resolve, reject) => {
      const usuario = process.env.LDAP_USER;
      const senha = process.env.LDAP_PWD;
      const servidor = process.env.LDAP_SERVER;
      const baseDN = 'OU=Sulplast,DC=dcsulplast,DC=corp';
      const outputFilePath = 'public/files/usersAd.json';
  
      const ldapOptions = {
        url: `ldap://${servidor}`
      };
  
      const client = ldap.createClient(ldapOptions);
  
      client.bind(usuario, senha, (bindErr) => {
        if (bindErr) {
            console.error('Erro na ligação:', bindErr);
            client.unbind();
            reject(bindErr);
        } else {
            console.log('Ligação bem-sucedida');
            const searchOptions = {
              filter: '(&(&(objectClass=user)(objectCategory=person)))',
              scope: 'sub',
              derefAliases: 2,
              attributes: ['cn', 'sAMAccountName', 'mail','userAccountControl'],
            };
  
          const usuarios = [];
  
          client.search(baseDN, searchOptions, (searchErr, searchRes) => {
            if (searchErr) {
              reject(searchErr);
            }
  
            searchRes.on('searchEntry', (entry) => {
                const usuarioInfo = {};

                entry.attributes.forEach((attribute) => {
                  const attributeName = attribute.type;
                  const attributeValue = attribute.vals[0] || 'Não Disponível';
              
                  usuarioInfo[attributeName] = attributeValue;
                });
              
                // Verifica se o userAccountControl é igual a "512" antes de adicionar ao array
                if (usuarioInfo.userAccountControl === "512") {
                  usuarios.push(usuarioInfo);
                }
   
            });
  
            searchRes.on('error', (error) => {
                console.error('Erro na resposta de pesquisa:', error);
              client.unbind();
              reject(error);
            });
  
            searchRes.on('end', () => {
                console.log('Pesquisa concluída');
                  // Adicione um log para visualizar os usuários encontrados detalhadamente
                    console.log('Usuários encontrados detalhados:', usuarios);
                      // Salvar os usuários no arquivo JSON

                      // Antes de salvar o arquivo, ordene o array por 'cn'
                      usuarios.sort((a, b) => {
                        // Comparação de strings insensível a maiúsculas e minúsculas (ordenando por 'cn')
                        return a.cn.localeCompare(b.cn, 'en', { sensitivity: 'base' });
                      });

                      fs.writeFileSync(outputFilePath, JSON.stringify(usuarios, null, 2));

                      console.log(`Usuários salvos em ${outputFilePath}`);
              client.unbind();
              resolve(usuarios);
            });
          });
        }
      });
    });
  }
  
  module.exports = {
    buscarUsuarios,
  };