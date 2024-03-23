module.exports = {
  apps: [
    {
      name: 'intranet-backend',
      script: '/var/www/servidor/app.js',
      cwd: '/var/www/servidor',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '200M',
      // ... outras configurações ...
    },
    {
      name: 'intranet-frontend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/react-project',
      watch: false,
      max_memory_restart: '200M',
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