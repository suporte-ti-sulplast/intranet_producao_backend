module.exports = {
  apps: [
    {
      name: 'intranet-backend',
      script: '/var/www/backend/app.js',
      cwd: '/var/www/backend',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      // ... outras configurações ...
    },
    {
      name: 'intranet-frontend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/frontend',
      watch: false,
      max_memory_restart: '500M',
      // ... outras configurações ...
    },
  ],
  // Configurações globais
  deploy: {
    production: {
      // Configurações de produção
    },
    development: {
      // Configurações de desenvolvimento
    },
  },
  // Configurações adicionais
  delay: 10000,
};