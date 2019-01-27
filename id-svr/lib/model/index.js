module.exports = (ioc, {
  assign  = Object.assign,
  user    = require('../dal/user')(ioc),
  session = require('../dal/session')(assign(ioc, {user})),
} = {}) => {
    const log = ioc.logger.of('id:model');

    assign(ioc, {user, session});
    return {
      user,
      session,
      login: ({usr, pwd}) => {
          const loginLog = log.child({usr});
          loginLog.debug('logging in', {usr});
          return user.checkPwd({usr, pwd})
          .then(ok => ok
            ? session.create({usr})
            : loginLog.info('password mismatch')
              && Promise.reject(new Error('bad creds'), {usr, pwd})
          )
      },
      sessionInfo: ({sessid}) => {
          return session.get({sessid})
          .then(session =>
            session
              ? user.get(session)
                .then(user => ({user, session}))
              : Promise.reject(assign(new Error('invalid session'), {sessid, code: 'EINVALIDSESS'}))
          )
      }
    }
}