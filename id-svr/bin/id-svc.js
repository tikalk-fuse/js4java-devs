const ioc     = { config: require('../lib/config')({}) };
const logger  = ioc.logger = require('../lib/logger')(ioc);
const log     = logger.of('main');

require('error-stringify')({splitStackTrace: true});

log.info('starting up');
log.debug('config', ioc.config);

const svc     = ioc.svc = require('../lib')(ioc);

svc.start((err, app) => {
    if (err) return log.error('could not start server: ' +  err.stack);

    ioc.app   = app;
    log.info('server started', app.svr.address());
});

process.once('SIGINT', shutdown('SIGINT'));
process.once('SIGTERM', shutdown('SIGTERM'));
process.on('uncaughtException', shutdown('error'));
process.on('unhandledRejection', shutdown('rejection'));

function shutdown(signal) {
    return (exit) => {
        exit instanceof Error
          ? log.error('Fatal Error - ', exit)
          : log.info('Accepted Shutdown signal: ', exit);

        svc.stop(err => log[ err ? 'error' : 'info' ]('shutdown complete ', err || 'ok'));
    }
}
