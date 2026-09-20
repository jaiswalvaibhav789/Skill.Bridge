/**
 * PM2 Process Management Configuration
 * Enterprise multi-core cluster orchestration for production node runtime.
 */
module.exports = {
  apps: [
    {
      name: 'skillbridge-api',
      script: './server.js',
      instances: 'max', // Leverage all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M', // Guard against memory leaks
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
