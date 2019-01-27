module.exports = ({model}, {
  router = require('express').Router(),
} = {}) => {
    
    router.get('/user/:usr', ({params: {usr}}, res, next) => {
        model.user.get({usr})
        .then(user =>
          user
            ? res.json(user)
            : res.status(404).json({error: 'no such user', usr})
        ).catch(next);
    });

    router.post('/user', ({log, body: {
      usr, pwd
    }}, res, next) => {
        log.info('got body', {usr, pwd});
        model.user.create({usr, pwd})
        .then(user => res.json(user))
        .catch(err => {
            if ('EUSERTAKEN' == err.code) return res.status(409).json({error:err.message, usr});
            next(err);
        })
    });

    return router
}