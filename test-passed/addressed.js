var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 2000;
var default_timeout = 10000;
var root = askkk.root;
var questionID = '-JUhgjhvKqKM-pS-ad2A';

//before testing, reset to this database.
var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';
var candidates_file_url = 'test/data/candidates.json';


describe('Candidate addressed', function () {
  this.timeout(default_timeout);

  beforeEach(function (done) {//before every test.

    fs.readFile(signatures_file_url, function (error, data) {
      expect(error).to.be(null);
      //root.child('signatures').remove();
      root.child('signatures').set(JSON.parse(data), function () {

        fs.readFile(questions_file_url, function (error, data) {
          expect(error).to.be(null);
          //root.child('questions').remove();
          root.child('questions').set(JSON.parse(data), function () {

                 fs.readFile(candidates_file_url, function (error, data) {
                   expect(error).to.be(null);
                   //root.child('candidates').remove();
                   root.child('candidates').set(JSON.parse(data), function () {
                     setTimeout(function () {
                       done();
                     }, default_wait);
                   });
                 });

          });
        });

      });
    });

  });


  it('[連勝文] should equal to real addressed', function (done) {
    root.child('candidates/-JFuCKMKOH_eCspPxRe1/addressed_count').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(7);
      done();
    });
  })

  it('[柯文哲] should equal to real addressed', function (done) {
    root.child('candidates/-JFuCJcAoUNFQY9NEHZ4/addressed_count').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(6);
      done();
    });
  });

  it('[馮光遠] should equal to real addressed', function (done) {
    root.child('candidates/-JFxrKQo3Qg19zsW73b1/addressed_count').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(5);
      done();
    });
  });


  it('[連勝文] should +1 when a new question passed the threshold', function (done) {
    root.child('questions/'+ questionID).once('value', function (snapshot) {
      var ref = root.child('signatures/'+ questionID + '/facebook:123456789').set({
        "timestamp": 1408526103000
      }, function (error) {
        setTimeout(function () {
          root.child('candidates/-JFuCKMKOH_eCspPxRe1/addressed_count').once('value', function (snapshot) {
            expect(snapshot.val()).to.be(8);
            done();
          });
        }, default_wait);
      });
    });
  });

});

