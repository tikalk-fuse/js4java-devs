module.exports = (ioc, {
  svrFcty = require('./web/server')
} = {}) => {
    const { config, logger } = ioc
    const log = logger.of('lib/index');
    
    const app = svrFcty(ioc);

    log.debug('constructed');

    //TODO: init DAL
    
    //TODO: init model
    
    //TODO: init app with the model
    
    return {
      stop: (next) => app.stop(next),
      start: (next) => {
          //
          app.start( next )
      }
      
    }
}