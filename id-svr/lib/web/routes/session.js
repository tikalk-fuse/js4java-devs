module.exports = ({
  model,
  router = require('express').Router(),
}) => {

    router.get('/auth/:sessid', ({params: {sessid}}, res, next) => {
        model.sessionInfo({sessid})
        .then(info => info
          ? res.json(info)
          : res.status(404).json({error: 'no such session'})
        )
        .catch(err => 
          'EINVALIDSESS' == err.code
          ? res.status(404).json({error: 'no such session'})
          : next(err)
        )
    });
    
    router.get('/hello', ({cookies: { sessid }}, res, next) => {
        if (!sessid) return notFound();

        model.sessionInfo({sessid})
        .then(info => info
          ? res.json(info)
          : notFound()
        )
        .catch(err => 
          'EINVALIDSESS' == err.code
            ? notFound()
            : next(err)
        )

        function notFound() {
            res.status(404).json({message: 'hello, stranger. please login or register'});
        }
    });

    router.post('/login', ({body: {usr, pwd, rurl}}, res, next) => {
        model.login({usr, pwd})
        .then((session) => {
            res.cookie('sessid', session.sessid);
            rurl
            ? res.redirect(rurl)
            : res.json(session);
        })
        .catch(next)
    });

    router.post('/logout', ({cookies:{sessid}}, res, next) => {
        res.clearCookie('sessid');
        const ok = {message:'ok'};
        if (!sessid) return res.json(ok);
        model.session.end({sessid})
        .then(() => res.json(ok))
        .catch(next)
    });

    return router
}