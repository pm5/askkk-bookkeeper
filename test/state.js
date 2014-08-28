var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 5000;
var default_timeout = 10000;
var root = askkk.root;
var passed_questionID = '-JGJkvFmuIfUGHQuLLCI';
var ended_questionID = '-JGKChdmAKN7rb0eBM_U';
var collecting_questionID = '-JUggGBra5aYQ_D77rxD';


//before testing, reset to this database.
var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';

describe('State of [passed] question', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.
    root.child('signatures').remove();
    fs.readFile(signatures_file_url, function (error, data) {
      expect(error).to.be(null);
      root.child('signatures').set(JSON.parse(data), function () {
        /* ----- */
        fs.readFile(questions_file_url, function (error, data) {
          expect(error).to.be(null);
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

  it('should have passed state', function (done) {
    setTimeout(function () {
        root.child('questions/'+ passed_questionID).once('value', function (snapshot) {
            expect(snapshot.val().state.passed).to.be('passed');
            done();
        });
    }, default_wait);
  })

  it('should not have ended state', function (done) {
    setTimeout(function () {
      root.child('questions/'+ passed_questionID).once('value', function (snapshot) {
          expect(snapshot.val().state.ended).to.be(undefined);
          done();
      });
    }, default_wait);
  });

});

describe('State of [ended] question', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.
    root.child('signatures').remove();

    fs.readFile(signatures_file_url, function (error, data) {
      expect(error).to.be(null);

      root.child('signatures').set(JSON.parse(data), function () {
        /* ----- */
        fs.readFile(questions_file_url, function (error, data) {
          expect(error).to.be(null);
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

  it('should have ended state', function (done) {
    root.child('questions/'+ ended_questionID).once('value', function (snapshot) {
      expect(snapshot.val().state.ended).to.be("ended");
      done();
    });
  });

});

describe('State of [collecting] question', function () {
  this.timeout(default_timeout);
  beforeEach(function (done) {//before every test.

    fs.readFile(signatures_file_url, function (error, data) {
      expect(error).to.be(null);
      root.child('signatures').remove();
      root.child('signatures').set(JSON.parse(data), function () {
        /* ----- */
        fs.readFile(questions_file_url, function (error, data) {
          expect(error).to.be(null);
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

  it('should have collecting state', function (done) {
    root.child('questions/'+ collecting_questionID).once('value', function (snapshot) {
      expect(snapshot.val().state.collecting).to.be('collecting');
      done();
    });
  })

  it('should not have ended state', function (done) {
    root.child('questions/'+ collecting_questionID).once('value', function (snapshot) {
      expect(snapshot.val().state.ended).to.be(undefined);
      done();
    });
  });

  it('should not have passed state', function (done) {
    root.child('questions/'+ collecting_questionID).once('value', function (snapshot) {
      expect(snapshot.val().state.passed).to.be(undefined);
      done();
    });
  });

});