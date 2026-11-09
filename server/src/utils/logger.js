// Simple structured console logger

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  let metaStr = '';
  if (meta) {
    if (meta instanceof Error) {
      metaStr = ` ${meta.message} \n${meta.stack}`;
    } else {
      metaStr = ` ${typeof meta === 'object' ? JSON.stringify(meta) : meta}`;
    }
  }
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

const logger = {
  info: (msg, meta) => {
    console.log(`\x1b[36m${formatMessage('info', msg, meta)}\x1b[0m`);
  },
  warn: (msg, meta) => {
    console.warn(`\x1b[33m${formatMessage('warn', msg, meta)}\x1b[0m`);
  },
  error: (msg, meta) => {
    console.error(`\x1b[31m${formatMessage('error', msg, meta)}\x1b[0m`);
  },
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`\x1b[90m${formatMessage('debug', msg, meta)}\x1b[0m`);
    }
  },
};

module.exports = logger;
