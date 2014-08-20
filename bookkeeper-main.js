'use strict'

var Firebase = require('firebase'),
    nconf = require('nconf'),
    CronJob = require('cron').CronJob;

var Q = require('q');

nconf.file({ file: 'config/askkk-bookkeeper.json' })
  .defaults({
    "firebase": "https://askkkkk-dev.firebaseio.com/",
    "firebase_secret": "etZEKPiPhvkc7kKBoyAQDCe8vEr0ykp5nO5cMlgZ"
  });

var root = new Firebase(nconf.get('firebase'))
root.auth(nconf.get('secret'), function (error) { if (error)  throw error; });



function monitorQuestionAddressedCount(root) {
  root.child('candidates').once('value', function (snap) {
    for (var cid in snap.val()) {
      root.child('candidates/' + cid + '/addressed_count').set(0);
    }
    root.child('questions').on('child_added', updateQuestionAddressedCount);
    root.child('questions').on('child_changed', updateQuestionAddressedCount);
  });
}

function updateQuestionAddressedCount(snap) {
  if (snap.val().state.passed) {
    for (var cid in snap.val().addressing) {
      root.child("candidates/" + cid + "/addressed_count").transaction(function (it) { return it + 1; });
    }
  }
}

exports.run = function () {

  root.child('signatures').on('child_added', updateQuestionTimestamp);
  var job = new CronJob('0 0 * * *', updateQuestionState);

};
