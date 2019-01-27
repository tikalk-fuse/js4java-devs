module.exports = ({
  logger,
  model,
  router = require('express').router()
}) => {

    router.get('/auth/:sessid', ({params: {sessid}, res, next) => {
        res.status(500).json({ message: 'not impl'})

        model.sessionInfo({sessid})
        .then((sessInfo) => res.status(200).json(sessInfo))
        .catch(err =>
          err.code == 'EINVALID'
            ? res.status(404).json({error: 'no such session, sessid'))
            : next(err)
        )
            
    });

    router.post('/login', (req, res, next) => {
        res.status(500).json({ message: 'not impl'})
    });
    return router
}