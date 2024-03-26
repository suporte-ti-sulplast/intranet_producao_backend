module.exports = {
  apps: [
    {
      name: 'backend-DEV',
      script: '/var/www/backend/app.js',
      cwd: '/var/www/backend',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '200M',
      // ... outras configurações ...
    },
    {
      name: 'frontend-DEV',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/frontend',
      watch: true,
      max_memory_restart: '200M',
      // ... outras configurações ...
    },
  ],
  // Configurações adicionais
  delay: 10000,
};