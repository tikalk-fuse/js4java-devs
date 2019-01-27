module.exports = (ioc, {
  dbFcty = require('./dal/db'),
  modelFcty = require('./model'),
  webAppFcty = require('./web/server'),
  assign = Object.assign,
} = {}) => {
    const {config, logger} = ioc;
    const log = logger.of('id:lib');
    log.debug('constructed');

    const svc = {
      start: (next) => {
          const db = ioc.db = dbFcty(ioc);
          db.start()
          .then(con => {
              db.con = con;
              ioc.model = modelFcty(ioc);
              ioc.app = webAppFcty(ioc);
              ioc.app.start(next)
          })
          .catch(err => {
              ioc.db && ioc.db.stop();
              next(err, ioc.app);
          });
      },
      stop: next => {
          Promise.all([
            ioc.db.stop(),
            ioc.app.stop(),
          ])
          .then(() => next())
      }
    };

    return svc;
}