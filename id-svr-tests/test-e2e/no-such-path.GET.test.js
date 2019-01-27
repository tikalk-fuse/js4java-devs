const request = require('mocha-ui-exports-request');
const SUT = process.env.SUT || 'http://localhost:3000';

module.exports = {
  'default 404': {
    'when called with an unsupported path': request({
      url:    SUT + '/no-such-path',
      method: 'GET',
      json:   true
    })
    .responds({
      status: 404,
      headers: {
        'content-type': /^application\/json/
      },
      body: {
        'should have property error:no such endpoint': 
          (body) => Should(body).have.property('error', 'no such endpoint'),
        'should have property url:<the url>':
          (body) => Should(body).have.property('url', '/no-such-path'),
        'should have property method:<the method>':
          (body) => Should(body).have.property('method', 'GET'),
      }
    })
  }
};
