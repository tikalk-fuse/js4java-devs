module.exports = ({
  config,
  winston = require('winston'),
  cap = require('lodash/capitalize'),
}) => {
    const logCfg = Object.assign({}, config.logger);
    logCfg.transports = logCfg.transports.map(
      ({type, options}) => new winston.transports[type](options)
    );
    if (logCfg.format) logCfg.format = winston.format[logCfg.format]();
    if (logCfg.colorize) logCfg.format = winston.format.combine(
      winston.format.colorize(),
      logCfg.format
    );

    const log = winston.createLogger(logCfg);
    log.of = name => log.child({name});
    log.mw = () => (req, res, next) => {
        req.log = log.child({reqId: req.id, url: req.originalUrl});
        next()
    }
    return log
}
