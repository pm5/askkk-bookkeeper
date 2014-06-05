var expect = require('expect.js');
var fs = require('fs');
var askkk = require('../lib/askkk');
var default_wait = 2000;
var default_timeout = 10000;
var root = askkk.root

describe('Questions count', function () {
  this.timeout(default_timeout);
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
    root.child('count/questions').once('value', function (snapshot) {
      var number = snapshot.val();
      var ref = root.child('questions').push();
      ref.set({
        "title" : "哈囉哈囉",
        "content" : [ "請問我可以問問題嗎？" ],
        "asker" : "816028916",
        "category" : [ "農業", "居住", "社會住宅" ],
        "post_timestamp" : 1398419407189,
        "deadline_timestamp" : 1401011407189,
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

  it('should add to categories when adding questions', function (done) {
    root.child('categories/農業').once('value', function (snapshot) {
      var entries = snapshot.val();
      if (null === entries) entries = {};
      var ref = root.child('questions').push();
      expect(entries[ref.name()]).to.be(undefined);
      ref.set({
        title: '哈囉',
        category: ['農業'],
      }, function (error) {
        setTimeout(function () {
          root.child('categories/農業').once('value', function (snapshot) {
            expect(snapshot.val()[ref.name()]).to.be(true);
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
