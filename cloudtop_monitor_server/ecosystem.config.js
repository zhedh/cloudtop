module.exports = {
  apps: [
    {
      name: 'cloudtop_monitor_server',
      script: './lib/index.js',
      // instances: 1,
      // env_staging: {
      //   NODE_ENV: 'staging',
      // },
      // env_production: {
      //   NODE_ENV: 'production',
      // },
    },
  ],
}
