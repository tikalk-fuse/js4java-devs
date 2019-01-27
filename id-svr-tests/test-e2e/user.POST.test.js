const mgr = require('../test/fx/mgr')({});
const request = require('mocha-ui-exports-request');
const jar = require('request').jar;
const SUT = process.env.SUT || 'http://localhost:3000';

module.exports = {
  'POST /user': {
    beforeAll: () => mgr.start(),
    afterAll: () => mgr.stop(),
    'when called with valid body': {
      'and usr that IS in the system': {
        beforeAll: () => mgr.user.set({usr: 'usr', pwd: 'pwd'}),
        afterAll: () => mgr.user.rm({usr: 'usr'}),
        '>>should give the user-taken view': request({
          method: 'POST',
          url: SUT + '/user',
          json: true,
          body: {
            usr: 'usr',
            pwd: 'pwd'
          }
        })
        .responds({
          status: 409,
          headers: { 'content-type': /^application\/json/ },
          body: {
            'should have error:user taken':
              (body) => Should(body).have.property('error', 'user taken'),
            'should include the user name':
              (body) => Should(body).have.property('usr', 'usr')
          }
        })
      },
      'and usr that is NOT in the system': {
        beforeAll: () => mgr.user.rm({usr: 'usr'}),
        afterAll: () => mgr.user.rm({usr: 'usr'}),
        '>>should echo back the created user profile': request({
          method: 'POST',
          url: SUT + '/user',
          json: true,
          body: {
            usr: 'usr',
            pwd: 'pwd'
          }
        })
        .responds({
          status: 200,
          headers: { 'content-type': /^application\/json/ },
          body: {
            'should foo': 
              (body) => Should(body).have.properties({
                usr: 'usr'
              })
              .have.properties(['pwd_sha', 'registeredAt'])
          },
          and: {
            'should create the user in the DB': () => mgr.user.get({usr:'usr'})
              .then((usr) => 
                Should(usr).have.properties({
                  usr: 'usr'
                }).have.properties(['pwd_sha', 'registeredAt'])
              )
          }
        })
      }
    }
  }
}
