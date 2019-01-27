module.exports = (ioc, {
  express      = require('express'),
  bodyParser   = require('body-parser'),
  cookieParser = require('cookie-parser'),
  morgan       = require('morgan'),
} = {}) => {
    const {logger, config} = ioc;
    const { web: { port } } = config;
    
    const log = logger.of('id:server');
    const app = express();

    app.use(morgan('common', { stream: logger }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    //TBD: load routes

    //default 404:
    app.use(({url, method}, res, next) => res
      .status(404)
      .json({error: 'no such endpoint', url, method })
    );

    //root level error handler
    app.use((err, req, res, next) => {
        log.error('error in route', {err});
        res.status(500).json({error: "oups"})
    });
    
    app.start = next => {
        app.svr = app.listen(port, (err) => {
            log.info('started', err || 'OK');
            next(err, app);
        })
    };
    
    app.stop = next => {
        log.warn('cosing server');
        app.svr.close(next)
    }

    return app
}
