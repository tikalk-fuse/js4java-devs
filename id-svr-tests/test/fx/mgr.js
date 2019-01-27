module.exports = ({
  config        = require('config'),
  redis         = require('redis'),
  promisifyAll  = require('bluebird').promisifyAll,
  uuid          = require('uuid').v4,
  crypto        = require('crypto'),
  db,
  sha = pwd => crypto
    .createHmac('sha256', config.persistence.shaSalt)
    .update(pwd).digest('hex'),
}) => ({
  start: () => {
    promisifyAll(redis.RedisClient.prototype);
    promisifyAll(redis.Multi.prototype);
    db = redis.createClient(config.persistence.redis);
  },
  stop: () => db.end(true),
  user: {
    set: ({usr, pwd, registeredAt = Date.now()}) =>
      db.hmsetAsync('usr:' + usr, {usr,pwd_sha: sha(pwd), registeredAt}),
    get: ({usr}) =>
      db.hgetallAsync('usr:' + usr),
    rm: ({usr}) =>
      db.delAsync('usr:' + usr),
  },
  session: {
    set: ({sessid = uuid(), usr, start = Date.now()}) =>
      db.hmsetAsync('sess:' + sessid, {sessid, usr, start}),
    get: ({sessid}) =>
      db.hgetallAsync('sess:' + sessid),
    rm: ({sessid}) =>
      db.delAsync('sess:' + sessid),
  }
});


