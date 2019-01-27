const mgr = require('../test/fx/mgr')({});
const request = require('mocha-ui-exports-request');
const jar = require('request').jar;
const SUT = process.env.SUT || 'http://localhost:3000';

module.exports = {
  'GET /user/:usr': {
    beforeAll: () => mgr.start(),
    afterAll: () => mgr.stop(),
    'when called with a user that is not found in the system': {
      '>>should give the no-such-user view': request({
        method: 'GET',
        url: SUT + '/user/no-such',
        json: true
      })
      .responds({
        status: 404,
        headers: { 'content-type': /^application\/json/ },
        body: {
          'should have error:no such user':
            body => Should(body).have.property('error').match(/no such user/),
          'should echo the user':
            body => Should(body).have.property('usr', 'no-such')
        }
      })
    },
    'when called with a user that is found in the system': {
      beforeAll: () => mgr.user.set({usr:'found', pwd: 'found'}),
      afterAll: () => mgr.user.rm({usr:'found'}),
      '>>should return the user profile': request({
        method: 'GET',
        url: SUT + '/user/found',
        json: true
      })
      .responds({
        status: 200,
        headers: { 'content-type': /^application\/json/ },
        body: {
          'should have property usr:<the user>':
            (body) => Should(body)
            .have.properties({
              usr: 'found'
            })
            .have.properties(['pwd_sha', 'registeredAt'])
        }
      })
    }
  }
}
