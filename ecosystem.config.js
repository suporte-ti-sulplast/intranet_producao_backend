module.exports = {
  apps: [
    {
      name: 'backend',
      script: '/var/www/backEnd/app.js',
      cwd: '/var/www/servidor',
      // ... outras configurações ...
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/frontEnd',
      // ... outras configurações ...
    },
  ],
};
  