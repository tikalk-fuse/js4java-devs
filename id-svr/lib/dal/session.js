module.exports = ({
  db: {con: db},
  logger,
  user,
  uuid = require('uuid').v4,
}) => {
    const log = logger.of('id:db:session');
    const sessionKey = sessid => `sess:${sessid}`;
    return {
      create: ({usr}) => {
          const sessid = uuid();
          const session = {
            usr,
            sessid,
            start: Date.now(),
          };
          const sesLog = log.child({session});
          sesLog.debug('creating session');
          return db.hmsetAsync(sessionKey(sessid), session)
          .then(() => sesLog.info('session created') && session);
      },
      get: ({sessid}) => {
          log.child({sessid}).debug('authenticating');
          return db.hgetallAsync(sessionKey(sessid));
      },
      end: ({sessid}) => {
          log.child({sessid}).debug('terminating');
          return db.delAsync(sessionKey(sessid));
      },
    }

}
