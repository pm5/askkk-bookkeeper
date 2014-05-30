var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 2000;
var root = askkk.root

describe('Questions count', function () {
  this.timeout(10000);
  beforeEach(function (done) {
    fs.readFile('test/questions.json', function (error, data) {
      expect(error).to.be(null);
      root.child('questions').set(JSON.parse(data), function () {
        setTimeout(function () {
          done();
        }, default_wait);
      });
    });
  });

  it('should calculate the number', function (done) {
    root.child('count/questions').once('value', function (snapshot) {
      expect(snapshot.val()).to.be(9);
      done();
    });
  })

  it('should add the number when adding questions', function (done) {
    var number = 0;
    root.child('count/questions').once('value', function (snapshot) {
      number = snapshot.val();
      var ref = root.child('questions').push();
      ref.set({
        "state" : {
          "collecting" : "collecting"
        },
        "addressing" : {
          "-JFuCJcAoUNFQY9NEHZ4" : {
            ".priority" : 5.0,
            "state" : "pending"
          }
        },
        "category" : [ "農業", "居住", "社會住宅" ],
        "votes_count" : 0,
        "post_date" : {
          "second" : "07",
          "hour" : "17",
          "year" : 2014,
          "month" : "04",
          "minute" : "50",
          "day" : "25"
        },
        "title" : "哈囉哈囉",
        "content" : [ "請問我可以問問題嗎？" ],
        "signatures_threshold" : 500,
        "asker" : "816028916",
        "post_timestamp" : 1398419407189,
        "deadline" : {
          "second" : "07",
          "hour" : "17",
          "year" : 2014,
          "month" : "05",
          "minute" : "50",
          "day" : "25"
        },
        "deadline_timestamp" : 1401011407189,
        "signatures_count" : 0,
        "responses_count" : 0
      }, function (error) {
        setTimeout(function () {
          root.child('count/questions').once('value', function (snapshot) {
            expect(snapshot.val()).to.be(number + 1);
            done();
          });
        }, default_wait);
      });
    });
  });

  it('should minus the number when removing questions', function (done) {
    var number = 0;
    root.child('count/questions').once('value', function (snapshot) {
      number = snapshot.val();
      root.child('questions/-JGMPB8dr2ENATZGqUgu').remove(function (error) {
        expect(error).to.be(null);
        setTimeout(function () {
          root.child('count/questions').once('value', function (snapshot) {
            expect(snapshot.val()).to.be(number - 1);
            done();
          });
        }, default_wait);
      });
    });
  });
});
