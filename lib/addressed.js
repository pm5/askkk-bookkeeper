var root;
var Q = require('Q');

function updateCandidateAddressed(questionId) {

  root.child("questions/" + questionId).once('value',function(snapshot){
      var question = snapshot.val();
      if(snapshot.val() !== null){
          for(var cid in question.addressing){
              if(snapshot.name() === "-JUhgjhvKqKM-pS-ad2A"){
                 console.log("[ update candidate_addressed ]"+ snapshot.val().title);

              }

              root.child("candidate_addressed/" + cid + '/' + snapshot.name()).set(true,function(){
                  //console.log("I FINISHED");
                  updateCandidateData();
              });
          }
      }

  },function(error){
      console.log(error);
  });

}
function updateCandidateData() {//listen on candidate_addressed

  root.child("candidate_addressed/").on('value',function(snapshot){
      var val = snapshot.val();

      for(var key in val){
          if(key === "-JFuCKMKOH_eCspPxRe1")
              console.log(val[key]);

          root.child("candidate_addressed/" + key).on('value',function(s){
              if(key === "-JFuCKMKOH_eCspPxRe1")
                 console.log("* " + key + " : " + s.numChildren() );
              root.child("candidates/" + key + '/addressed_count').set(s.numChildren());
          });
      }

  },function(error){
      console.log(error);
  });
}
function updateAddressedCount(snapshot) {//signature data

  var questionId = snapshot.name();
  var num = snapshot.numChildren();

  console.log("id "+questionId);

  root.child("questions/" + questionId).on('value',function(question){
      if(question.val() !== null){
          if(num >= question.val().signatures_threshold){
              //console.log(num);
              updateCandidateAddressed(questionId);
          }
          return;

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
     console.log('child_added event');
     setTimeout(function () {
        updateAddressedCount(snapshot);
     },3000);
  });
  root.child('signatures').on('child_changed', function(snapshot){
       console.log('child_changed event');
       updateAddressedCount(snapshot);
  });
  root.child('candidate_addressed').on('child_added', function(snapshot){
       console.log('[candidate_addressed] child_added event');
       updateCandidateData();
  });
  root.child('candidate_addressed').on('child_changed', function(snapshot){
       console.log('child_changed event');
       updateCandidateData();
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
     console.log('child_added event');
     setTimeout(function () {
        updateAddressedCount(snapshot);
     },3000);
});
root.child('signatures').on('child_changed', function(snapshot){
     console.log('child_changed event');
     updateAddressedCount(snapshot);
});
root.child('candidate_addressed').on('child_added', function(snapshot){
     console.log('[candidate_addressed] child_added event');
     updateCandidateData();
});
root.child('candidate_addressed').on('child_changed', function(snapshot){
     console.log('child_changed event');
     updateCandidateData();
});

*/




