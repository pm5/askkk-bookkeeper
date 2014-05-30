var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var root = askkk.root
var default_timeout = 10000;
var default_wait = 2000;

describe('Users count', function () {
  this.timeout(default_timeout);

  beforeEach(function (done) {
    root.child('users').set(JSON.parse(fs.readFileSync('test/users.json')), function (error) {
      setTimeout(function () {
        done();
      }, default_wait);
    });
  });

  it('should count user numbers', function (done) {
    root.child('count/users').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(1);
      done();
    });
  });

});
