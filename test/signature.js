var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 5000;
var default_timeout = 10000;
var root = askkk.root;
var questionID = '-JGJj9MVjeU7ezA_XC5R';

//before testing, reset to this database.
var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';

describe('Signatures Count', function () {
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

  it('should calculate the number and equal to signatures count.', function (done) {
    root.child('questions/'+ questionID + '/signatures_count').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(1509);
      done();
    });
  })

  it('should +2 when adding two signatures.', function (done) {

      root.child('signatures/'+ questionID +"/facebook:1406747912").set({
         "timestamp": 1408526103000
      }, function (error) {
         root.child('signatures/'+ questionID +"/facebook:1406747913").set({
         "timestamp": 1408526103000
         }, function (error) {

          setTimeout(function () {
             root.child('questions/'+ questionID + '/signatures_count').once('value', function (snapshot) {
               expect(snapshot.val()).to.be(1511);
               done();
             });
          }, default_wait);


         });

      });


  });

  it('should -1 when removing a signature.', function (done) {
      root.child('signatures/'+ questionID + '/facebook:1406747911').remove(function (error) {
        expect(error).to.be(null);
        setTimeout(function () {
          root.child('questions/'+ questionID + '/signatures_count').once('value', function (snapshot) {
            expect(snapshot.val()).to.be(1508);
            done();
          });
        }, default_wait);
      });

  });





});
