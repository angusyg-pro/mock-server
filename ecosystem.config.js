module.exports = {
  apps: [{
    name: 'mock-server',
    script: './server/src/bin/www',
    watch: ['./server/src'],
    ignore_watch: ['./node_modules', './logs'],
    max_memory_restart: '200M',
    wait_ready: true,
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    env: {},
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002,
      DB_URL: '10.0.129.86:27017',
    },
  }],
};
