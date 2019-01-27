module.exports = ({
  logger,
  config: {
    persistence: {
      redis: redisCfg
    }
  },
  assign = Object.assign,
  uuid = require('uuid').v4,
  Promise = require('bluebird'),
  promisifyAll = Promise.promisifyAll,
  redis = require('redis'),
  crypto = require('crypto'),
} = {}) => {
    const log = logger.of('id:db');
    let db;
    promisifyAll(redis.RedisClient.prototype);
    promisifyAll(redis.Multi.prototype);
    
    log.debug('constructed');
    return {
      start: () => new Promise((accept, reject) => {
          log.debug('starting');
          db = redis.createClient(redisCfg);
          db.once('error', reject);
          db.once('ready', () => {
              log.info('connected');
              db.removeListener('error', reject);
              accept(db);
          })
      }),
      stop: () => {
          log.info('closing');
          db.end(true);
      }
    }
}