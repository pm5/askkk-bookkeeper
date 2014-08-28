var root;
var now = Date.now();
var Q = require('q');

function getQuestionData(qid){
    var deferred = Q.defer();
    root.child("questions/" + qid).on('value',function(snapshot){
       deferred.resolve(snapshot.val());
    });
    return deferred.promise;
};
function getSignatureData(qid){
    var deferred = Q.defer();
    root.child("signatures/" + qid).on('value',function(snapshot){
       deferred.resolve(snapshot.numChildren());
    });
    return deferred.promise;
};

//Priority and State
function updatePriority(snapshot) {

  var questionId = snapshot.name();
  getQuestionData(questionId).then(function(question){



        if (snapshot.numChildren() >= question.signatures_threshold) {// passed
            //console.log(question.title);

            console.log(snapshot.name() + ': o ' + snapshot.numChildren());
            root.child("questions/" + questionId + "/state/passed").set("passed");
            root.child("questions/" + questionId + "/state/ended").remove();
            root.child("questions/" + questionId).setPriority(snapshot.numChildren());

        } else {
               if (question.deadline_timestamp > now) {// collecting
                   console.log(snapshot.name() + ': . ' + snapshot.numChildren());
                   root.child("questions/" + questionId).setPriority(snapshot.numChildren());
                   root.child("questions/" + questionId + "/state/collecting").set("collecting");
                   root.child("questions/" + questionId + "/state/ended").remove();

               } else {//ended
                   console.log(snapshot.name() + ': ! ' + snapshot.numChildren());
                   //add ended to state
                   root.child("questions/" + questionId + "/state/ended").set("ended");
                   root.child("questions/" + questionId).setPriority("ended." + snapshot.numChildren());
               }

        }




  });





};
function monitor(askkk) {
  root = askkk.root;
  root.child('signatures').on('child_added', updatePriority);
  root.child('signatures').on('child_changed', updatePriority);

};

module.exports.monitor = monitor;
module.exports.updatePriority = updatePriority;

/*
//test

var nconf = exports.conf = require('nconf');
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
root.child('signatures').on('child_added', updatePriority);
root.child('signatures').on('child_changed', updatePriority);
*/


