// ldapFunctions.js
require('dotenv').config();
const ldap = require('ldapjs');

// Configurações do servidor LDAP
const ldapConfig = {
  url: `ldap://${process.env.LDAP_SERVER}`,
  bindDN: process.env.LDAP_USER,
  bindCredentials: process.env.LDAP_PWD,
};

// Função para autenticar usuário no LDAP
async function authenticateUser(username, password) {
  const client = ldap.createClient({
    url: ldapConfig.url,
    referrals: true,
  });

  console.log(`Tentando autenticar usuário: ${username}`);

  return new Promise((resolve, reject) => {
    client.bind(ldapConfig.bindDN, ldapConfig.bindCredentials, (bindErr) => {
      if (bindErr) {
        console.error('Erro ao conectar ao servidor LDAP:', bindErr);
        reject(bindErr);
        return;
      }

      console.log('Conexão LDAP bem-sucedida.');

      client.search('OU=Sulplast,DC=dcsulplast,DC=corp', {
        filter: `(sAMAccountName=${username})`,
        scope: 'sub',
      }, (searchErr, searchRes) => {
        if (searchErr) {
          console.error('Erro ao buscar usuário no LDAP:', searchErr);
          client.unbind();
          reject(searchErr);
          return;
        }

        searchRes.on('searchEntry', (entry) => {
          console.log('Usuário encontrado:', entry.object);
          resolve(true);
        });

        searchRes.on('end', () => {
          console.log('Usuário não encontrado no LDAP.');
          resolve(false);
        });

        searchRes.on('referral', (referral) => {
          console.log('Referência encontrada:', referral);
          // Siga a referência manualmente aqui, se necessário
        });
      });
    });
  });
}

module.exports = {
  authenticateUser,
};
