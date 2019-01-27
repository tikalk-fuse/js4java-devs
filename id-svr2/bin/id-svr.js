const config = require('../lib/config')({});
const logger = require('../lib/logger')({config});

logger.info('starting server');
logger.debug('started with config', config);
const ioc = {logger, config}

const svc = require('../lib/index')(ioc);
svc.start((err, app) => {
   if  (err) {
      logger.error('could not start process', err);
      return
   }

   logger.info('successfully started at', app.svr.address());
   ioc.app = app;
});

process.on('SIGINT', shutdown('sigint'))
process.on('SIGTERM',shutdown('term'));
process.on('uncaughtException', shutdown('error'));


function shutdown(reason) { 
    return (signal) => {
        logger[
          'number' == typeof signal
          ? 'warn'
          : 'error'
        ]('Shutting down for - ', {reason, signal})
        
        svc.stop((err) => {
            if (err) logger.error('problems shutting down', {err})
        });
    }
} 