module.exports = {
  apps: [
    {
      name: 'backend',
      script: '/var/www/servidor/app.js',
      cwd: '/var/www/servidor',
      // ... outras configurações ...
    },
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      cwd: '/var/www/react-project',
      // ... outras configurações ...
    },
  ],
};
  