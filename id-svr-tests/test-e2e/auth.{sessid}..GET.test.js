const mgr = require('../test/fx/mgr')({});
const request = require('mocha-ui-exports-request');
const jar = require('request').jar;
const SUT = process.env.SUT || 'http://localhost:3000';

module.exports = {
  'GET /auth/:sessid': {
    beforeAll: () => mgr.start(),
    afterAll: () => mgr.stop(),
    'when called with a session-id that is NOT found': {
      '>> should give the hello-stranger view': request({
        url:    SUT + '/auth/no-such-uuid',
        method: 'GET',
        json:   true
      })
      .responds({
        status: 404,
        headers: {
          'content-type': /^application\/json/
        },
        body: {
          'should have property error matches - /no such session/': 
            (body) => Should(body).have.property('error').match(/no such session/),
        }
      })
    },
    'when called with a session-id that IS found': {
      beforeAll: () => Promise.all([
        mgr.user.set({usr: "aaa", pwd: "aaa", registeredAt: 111}),
        mgr.session.set({usr: "aaa", sessid: "sessid", start: 444})
      ]),
      afterAll: () => Promise.all([
        mgr.user.rm({usr: "aaa"}),
        mgr.session.rm({sessid: "sessid"})
      ]),
      '>>should provide the current-user view': request({
        url: SUT + '/auth/sessid',
        method: 'GET',
        json: true
      })
      .responds({
        status: 200,
        headers: {
          'content-type': /^application\/json/
        },
        body: {
          'should include the user object':
            (body) => Should(body).have.property('user').eql({
              pwd_sha: "b4933b4d3b459e404f69e553a3c84df4a20a17739b3b4abb5c0944acec5c7795",
              registeredAt: "111",
              usr: "aaa",
            }),
          'should include the session object':
            (body) => Should(body).have.property('session').eql({
              sessid: "sessid",
              start:  "444",
              usr:    "aaa",
            })
        }
      })
    }
  }
};
