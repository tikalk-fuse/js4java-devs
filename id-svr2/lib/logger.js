module.exports = ({
  config: {
    logger
  }
}, {
  winston = require('winston')
} = {}) => {
  
    const logCfg = Object.assign({}, logger);

    logCfg.transports = 
      logCfg.transports.map(
        ({type, options}) => 
          new winston.transports[type](options)
      );

    const rootLogger = winston.createLogger(logCfg);
    rootLogger.of = function(name) { 
      return this.child({name})
    }

    return rootLogger
}

