module.exports = (ioc, {
    session      = require('./routes/session')(ioc),
    user         = require('./routes/user')(ioc),
    errHandler   = require('./routes/err-handler'),
    express      = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    morgan       = require('morgan'),
    app          = express(),
    assign       = Object.assign
} = {}) => {
    const {
      logger,
      config: {
        env = 'dev',
        web: {
          port
        }
      }
    } = ioc;

    const log = logger.of('id:web');
    let svr;

    app.use(logger.mw());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(morgan('common'));
    app.use(session);
    app.use(user);

    app.use(({method, url}, res, next) => res.status(404).json({error: 'no such endpoint', method, url}));
    app.use(errHandler(env));

    log.debug('constructed');

    app.start = (next) => {
        log.debug('starting server');
        svr = app.svr = app.listen(port,
          (err) => next(err, app)
        );
    };
    
    app.stop = (next) => {
        log.debug('stopping server');
        svr.close(next)
    };
    
    return app;
}