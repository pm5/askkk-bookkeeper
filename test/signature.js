var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 2000;
var default_timeout = 10000;
var root = askkk.root
var questionID = '-JRzopYtoSvlt1CZZjDn';

describe('Signatures count', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.

    fs.readFile('test/signature' + questionID + '.json', function (error, data) {
      expect(error).to.be(null);
      root.child('signatures/' + questionID).set(JSON.parse(data), function () {

        /* -- */
        fs.readFile('test/question' + questionID + '.json', function (error, data) {
          expect(error).to.be(null);
          root.child('questions/'+ questionID).set(JSON.parse(data), function () {
            setTimeout(function () {
              done();
            }, default_wait);
          });
        });
        /* -- */

      });
    });

  });

  it('should calculate the number', function (done) {
    root.child('questions/'+ questionID + '/signatures_count').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(385);
      done();
    });
  })


});
