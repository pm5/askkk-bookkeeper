var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 5000;
var default_timeout = 12000;
var root = askkk.root;
var questionID_passed = '-JGKCvMcN_pV8ll9oSOb';
var questionID_almost_passed = '-JUhgjhvKqKM-pS-ad2A';

//before testing, reset to this database.
var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';

describe('Meettime', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.

    fs.readFile(signatures_file_url, function (error, data) {
      expect(error).to.be(null);
      root.child('signatures').remove();
      root.child('signatures').set(JSON.parse(data), function () {

        fs.readFile(questions_file_url, function (error, data) {
          expect(error).to.be(null);
          //root.child('questions').remove();
          root.child('questions').set(JSON.parse(data), function () {
              setTimeout(function () {
                  done();
               }, default_wait);

          });
        });

      });
    });

  });

  it('should calculate the number and equal to the "signatures threshold" signature time.', function (done) {
    root.child('questions/'+ questionID_passed + '/meet_timestamp').once('value', function (snapshot) {
         expect(snapshot.val()).to.be(1394722764623);
         done();
    });
  })

  it('should calculate when a new question passed the threshold', function (done) {
    root.child('questions/'+ questionID_almost_passed).once('value', function (snapshot) {
      var ref = root.child('signatures/'+ questionID_almost_passed + '/facebook:123456789').set({
        "timestamp": 1408957715000
      }, function (error) {
        setTimeout(function () {
          root.child('questions/'+ questionID_almost_passed + '/meet_timestamp').once('value', function (snapshot) {
               expect(snapshot.val()).to.be(1408957715000);
               done();
          });
        }, default_wait);
      });
    });
  });







});
