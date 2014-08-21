var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 2000;
var default_timeout = 10000;
var root = askkk.root;
var questionID = '-JGJj9MVjeU7ezA_XC5R';

describe('Priority', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.

    fs.readFile('test/signature/signatures.json', function (error, data) {
      expect(error).to.be(null);
      root.child('signaturess').remove();
      root.child('signatures').set(JSON.parse(data), function () {
        /* ----- */
        fs.readFile('test/signature/questions.json', function (error, data) {
          expect(error).to.be(null);
          root.child('questions').remove();
          root.child('questions').set(JSON.parse(data), function () {
            setTimeout(function () {
              done();
            }, default_wait);
          });
        });
        /* ----- */
      });
    });

  });

  it('should equal to signatures count', function (done) {
    root.child('questions/'+ questionID).once('value', function (snapshot) {
      expect(snapshot.getPriority()).to.be(snapshot.val().signatures_count);
      done();
    });
  })

  it('should +1 when adding one signature', function (done) {
    root.child('questions/'+ questionID).once('value', function (snapshot) {
      var number = snapshot.getPriority();
      var ref = root.child('signatures/'+ questionID + '/facebook:1406747912').set({
        "timestamp": 1408526103000
      }, function (error) {
        setTimeout(function () {
          root.child('questions/'+ questionID).once('value', function (snapshot) {
            expect(snapshot.getPriority()).to.be(number + 1);
            done();
          });
        }, default_wait);
      });
    });
  });

  it('should -1 when removing one signature.', function (done) {
    root.child('questions/'+ questionID).once('value', function (snapshot) {
      var number = snapshot.getPriority();
      root.child('signatures/'+ questionID + '/facebook:1406747911').remove(function (error) {
        expect(error).to.be(null);
        setTimeout(function () {
          root.child('questions/'+ questionID).once('value', function (snapshot) {
            expect(snapshot.getPriority()).to.be(number - 1);
            done();
          });
        }, default_wait);
      });
    });
  });

  it('should re-calculate when question.signatures_count changed.', function (done) {
    var ref = root.child('questions/'+ questionID + '/signatures_count').set(
      2014,
    function (error) {
        setTimeout(function () {
          root.child('questions/'+ questionID).once('value', function (snapshot) {
            expect(snapshot.getPriority()).to.be(snapshot.val().signatures_count);
            done();
          });
        }, default_wait);
      });
  });





});
