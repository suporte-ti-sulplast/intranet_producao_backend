module.exports = {
  apps: [
    {
      name: 'backend-DEV-2',
      script: '/var/www/backend_2/app.js',
      cwd: '/var/www/backend_2',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '200M',
      // ... outras configurações ...
    },
    {
      name: 'frontend-DEV-2',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/frontend_2',
      watch: true,
      max_memory_restart: '200M',
      // ... outras configurações ...
    },
  ],
  // Configurações adicionais
  delay: 10000,
};