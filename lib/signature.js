var root;
var Firebase = require('firebase'),
    nconf = require('nconf'),
    Q = require('q');

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
function monitor(askkk) {
  root = askkk.root;

  root.child('questions').on('child_added', updateSignatureCount);
  root.child('questions').on('child_changed', updateSignatureCount);

  root.child('signatures').on('child_added', updateQuestionCount);
  root.child('signatures').on('child_changed', updateQuestionCount);
};

module.exports.monitor = monitor;


