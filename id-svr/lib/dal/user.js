module.exports = ({
  config: {
    persistence: { shaSalt }
  },
  db: {con: db},
  logger,
  assign = Object.assign,
  crypto = require('crypto'),
} = {}) => {
    const log = logger.of('id:db:user');

    const userKey = name => `usr:${name}`;
    const sha = pwd => crypto
      .createHmac('sha256', shaSalt)
      .update(pwd).digest('hex');

    return {
      get: ({usr}) =>
        log.child({usr}).debug('getting user')
        && db.hgetallAsync(userKey(usr)),
      checkPwd: ({usr, pwd}) =>
        log.child({usr}).debug('checking password')
        && db.hgetAsync(userKey(usr), 'pwd_sha')
           .then(pwd_sha => pwd_sha == sha(pwd)),
      create: ({
        usr,
        pwd
      }) => {
          const key = userKey(usr);
          const pwd_sha = sha(pwd);
          const user = {
            usr,
            pwd_sha,
            registeredAt: Date.now() 
          };
          const uLog = log.child({user});
          uLog.debug('trying to create user');

          return db
          .hgetAsync(key, 'usr')
          .then(usr => usr
             ? uLog.warn('user taken')
               && Promise.reject(assign(new Error('user taken'), {usr, code: 'EUSERTAKEN'}))
             : db.hmsetAsync(key, user)
          )
          .then(() => uLog.info('user added') && user)
      }
    };
}
