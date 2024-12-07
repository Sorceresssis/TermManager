module.exports = {
  apps: [
    {
      name: 'TermManager',
      script: './dist/app.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};