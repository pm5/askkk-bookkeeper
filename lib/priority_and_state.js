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

        var count = snapshot.numChildren();
        var priority = - snapshot.numChildren();

        if (count >= question.signatures_threshold) {// passed
            //console.log(question.title);
            console.log(snapshot.name() + ': o ' + count + " / " + priority);
            root.child("questions/" + questionId + "/state/passed").set("passed");
            root.child("questions/" + questionId + "/state/ended").remove();
            root.child("questions/" + questionId).setPriority(priority);

        } else {
               if (question.deadline_timestamp > now) {// collecting
                   console.log(snapshot.name() + ': . ' + count + " / " + priority);
                   root.child("questions/" + questionId + "/state/collecting").set("collecting");
                   root.child("questions/" + questionId + "/state/ended").remove();
                   root.child("questions/" + questionId).setPriority(priority);

               } else {//ended
                   priority = question.signatures_threshold - count;
                   console.log(snapshot.name() + ': ! ' + count + " / " + priority);
                   //add ended to state
                   root.child("questions/" + questionId + "/state/ended").set("ended");
                   root.child("questions/" + questionId).setPriority(priority);
               }

        }

  });

};
function updateState(){

  console.log("<< I'm updating question state. Yes, I'm working hard. >>");
  root.child("update/state").remove();
  root.child("questions/").on('value',function(snapshot){

      var questions = snapshot.val();
      root.child("signatures/").on('value',function(snapshot){
          var signatures = snapshot.val();
          for(var questionId in signatures){
              var count = Object.keys(signatures[questionId]).length;

              if (count >= questions[questionId].signatures_threshold) {// passed
                  //console.log(question.title);
                  console.log(questionId + ': o ' + count);
                  root.child("questions/" + questionId + "/state/passed").set("passed");
                  root.child("questions/" + questionId + "/state/ended").remove();
                  root.child("questions/" + questionId).setPriority(count);

              } else {
                  if (questions[questionId].deadline_timestamp > now) {// collecting
                      console.log(questionId + ': . ' + count);
                      root.child("questions/" + questionId).setPriority(count);
                      root.child("questions/" + questionId + "/state/collecting").set("collecting");
                      root.child("questions/" + questionId + "/state/ended").remove();

                  } else {//ended
                      console.log(questionId + ': ! ' + count);
                      //add ended to state
                      root.child("questions/" + questionId + "/state/ended").set("ended");
                      root.child("questions/" + questionId).setPriority("ended." + count);
                  }
              }
          }
      });


  });

}
function monitor(askkk) {
  root = askkk.root;
  root.child('signatures').on('child_added', updatePriority);
  root.child('signatures').on('child_changed', updatePriority);

  root.child('update').on('child_added', updateState);
  root.child('update/state').on('child_changed', updateState);

};

module.exports.monitor = monitor;


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
root.child('update').on('child_added', updateState);
root.child('update/state').on('child_changed', updateState);


