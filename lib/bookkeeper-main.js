'use strict'

var Firebase = require('firebase'),
    nconf = require('nconf'),
    Q = require('q'),
    CronJob = require('cron').CronJob;

nconf.file({ file: 'config/askkk-bookkeeper.json' })
  .defaults({
    "firebase": "https://askkkkk-dev.firebaseio.com/",
    "firebase_secret": "etZEKPiPhvkc7kKBoyAQDCe8vEr0ykp5nO5cMlgZ"
  });

var root = exports.root = new (require('firebase'))(nconf.get('firebase'));
root.auth(nconf.get('firebase_secret'), function (error) {
  if (error) {
    console.log(error);
  }
});

function getSignatureData(qid){
     var deferred = Q.defer();
     root.child("signatures/" + qid).on('value',function(snapshot){
        deferred.resolve(snapshot.val());
     });
     return deferred.promise;
};
function updateSignatureCount(data) {

  var question = data.val();
  var questionId = data.name();

  getSignatureData(questionId).then(function(signatures){

      var signatures_count = Object.keys(signatures).length;
      console.log("Q[record]" + question.signatures_count + " <> " + signatures_count + "[real]  ## QID:"+questionId);
      root.child("questions/" + questionId + "/signatures_count").set(signatures_count);

  },function(error){
      console.log(error);
  });

};
function getQuestionData(qid){
     var deferred = Q.defer();
     root.child("questions/" + qid).on('value',function(snapshot){
        deferred.resolve(snapshot.val());
     });
     return deferred.promise;
};
function updateQuestionCount(data) {

  var val = data.val();
  var questionId = data.name();
  var signatures_count = Object.keys(val).length;

  getQuestionData(questionId).then(function(question){

      console.log("S[record]" + question.signatures_count + " <> " + signatures_count + "[real]  ## QID:"+questionId);
      root.child("questions/" + questionId + "/signatures_count").set(signatures_count);

  },function(error){
      console.log(error);
  });
};
/*
exports.run = function () {
  root.child('questions').on('child_added', updateSignatureCount);
  root.child('questions').on('child_changed', updateSignatureCount);

  root.child('signatures').on('child_added', updateQuestionCount);
  root.child('signatures').on('child_changed', updateQuestionCount);
};
*/

root.child('questions').on('child_added', updateSignatureCount);
root.child('questions').on('child_changed', updateSignatureCount);

root.child('signatures').on('child_added', updateQuestionCount);
root.child('signatures').on('child_changed', updateQuestionCount);


