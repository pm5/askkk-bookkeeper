var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 5000;
var default_timeout = 10000;
var root = askkk.root;
var questionID = '-JUhgjhvKqKM-pS-ad2A';

//before testing, reset to this database.
var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';
var candidates_file_url = 'test/data/candidates.json';
var candidate_addressed_file_url = 'test/data/candidate_addressed.json';

describe('Candidate addressed', function () {
  this.timeout(default_timeout);

  beforeEach(function (done) {//before every test.

         console.log("1");
         fs.readFile(signatures_file_url, function (error, data) {
            expect(error).to.be(null);
            root.child('signatures').set(JSON.parse(data), function () {

                 console.log("2");
                 fs.readFile(candidates_file_url, function (error, data) {
                        expect(error).to.be(null);

                        root.child('candidates').set(JSON.parse(data), function () {
                              console.log("3");

                              fs.readFile(candidate_addressed_file_url, function (error, data) {
                                     console.log("4");
                                     expect(error).to.be(null);
                                     root.child('candidate_addressed').set(JSON.parse(data), function () {
                                         setTimeout(done, default_wait);

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
        "timestamp": 123456789000
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

