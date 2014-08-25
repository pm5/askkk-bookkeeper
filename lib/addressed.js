var root;
var Q = require('Q');

function updateCandidateAddressed(questionId) {
  var deferred = Q.defer();

  root.child("questions/" + questionId).on('value',function(snapshot){
      var question = snapshot.val();

      if(snapshot.val() !== null){
         for(var cid in question.addressing){
             root.child("candidate_addressed/" + cid + '/' + snapshot.name()).set(true);
         }
      }

      deferred.resolve(true);

  },function(error){
      console.log(error);
  });
  return deferred.promise;
}
function updateCandidateData() {

  root.child("candidates/").on('value',function(data){
      var candidates = data.val();

      for(cid in candidates){

          root.child("candidate_addressed/"+ cid ).on('value',function(snapshot){
              var num = snapshot.numChildren();
              root.child("candidates/" + snapshot.name() + '/addressed_count').set(num);
          });
      }

  },function(error){
      console.log(error);
  });
}
function updateAddressedCount(snapshot) {//signature data

  var questionId = snapshot.name();
  var num = snapshot.numChildren();

  //console.log("id "+questionId);

  root.child("questions/" + questionId).on('value',function(question){
      if(question.val() !== null){

         console.log(num);

         if(num >= question.val().signatures_threshold){

            updateCandidateAddressed(questionId).then(function(){
                updateCandidateData();
            });
         }


      }else{
         console.log("! question not found ! <in addressed> questionId = " + questionId);
      }



  },function(error){
      console.log(error);
  });

};

function monitor(askkk) {
  root = askkk.root;


  root.child('signatures').on('child_added', function(snapshot){
       updateAddressedCount(snapshot);
  });
  root.child('signatures').on('child_changed', function(snapshot){
       updateAddressedCount(snapshot);
  });

};

module.exports.monitor = monitor;

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


root.child('signatures').on('child_added', function(snapshot){
     console.log('signatures child_added event');
     updateAddressedCount(snapshot);
});
root.child('signatures').on('child_changed', function(snapshot){
     console.log('signatures child_chnaged event');
     updateAddressedCount(snapshot);
});
*/

