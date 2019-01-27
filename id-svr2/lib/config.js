module.exports = ({
  config = require('config'),
  assign = Object.assign
}) =>  {
   const reason = 
    'object' != typeof config && 'config is not an object'
    || 'string' != typeof config.env;

    //....validate redis config
    //....validate logger config

    if (reason) throw assign(new Error(reason), {config});

    return config;
}
  




  
