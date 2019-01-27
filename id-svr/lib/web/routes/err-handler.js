module.exports = (env) => (err, {
  log,
  method, 
  originalUrl: url,
  headers,
  cookies,
  params,
  body,
}, res, next) => {
    err = err.toJSON();
    log.error('error in route', { 
      req: { method, url, headers, cookies, params, body },
      err
    });
    if (env != 'dev') err.stack = undefined;
    res.status(err.status || 500)
    .json({error: 'error in route', err});
}