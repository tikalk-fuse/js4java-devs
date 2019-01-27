const mgr = require('../test/fx/mgr')({});
const request = require('mocha-ui-exports-request');
const jar = require('request').jar;
const SUT = process.env.SUT || 'http://localhost:3000';

module.exports = {
  'POST /login': {
    beforeAll: () => mgr.start(),
    afterAll: () => mgr.stop(),
    'when called with valid body': {
      'and creds that are found in the system': {
        'and NO rurl': {
          beforeAll: () => mgr.user.set({ usr: 'usr', pwd: 'pwd' }),
          afterAll: () => mgr.user.rm({ usr: 'usr' }),
          '>>should login the user, set cookie and return the session': request({
            method: 'POST',
            url: SUT + '/login',
            json: true,
            body: { usr: 'usr', pwd: 'pwd' }
          })
          .responds({
            status: 200,
            headers: {
              'set-cookie': /sessid=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
            },
            body: {
              'should be the session object':
                (body) => Should(body).have.properties(['start'])
                .have.properties({usr: 'usr'})
                .have.property('sessid').match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
            },
            and: block(() => {
                let sessid;
                return {
                  'create the session in the DB': (res) =>
                    mgr.session.get({sessid: sessid =
                      res.headers['set-cookie'][0].match(
                        /sessid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
                      )[1]
                    })
                    .then(session => Should.exist(session)),
                  afterAll: () => mgr.session.rm({sessid})
                }
            })
          })
        },
        'and WITH rurl': {
          beforeAll: () => mgr.user.set({ usr: 'usr', pwd: 'pwd' }),
          afterAll: () => mgr.user.rm({ usr: 'usr' }),
          '>>should login the user, set cookie and return the session': request({
            method: 'POST',
            url: SUT + '/login',
            json: true,
            body: { 
              usr: 'usr', pwd: 'pwd', 
              rurl: 'http://mysite.com' 
            },
            followRedirect: false
          })
          .responds({
            status: 302,
            headers: {
              'set-cookie': /sessid=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
              location: /http:\/\/mysite.com/
            },
            and: block(() => {
                let sessid;
                return {
                  'create the session in the DB': (res) =>
                    mgr.session.get({sessid: sessid =
                      res.headers['set-cookie'][0].match(
                        /sessid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
                      )[1]
                    })
                    .then(session => Should.exist(session)),
                  afterAll: () => mgr.session.rm({sessid})
                }
            })
          })
        }
      }
    }
  }
}