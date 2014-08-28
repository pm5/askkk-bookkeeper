var root;
var Firebase = require('firebase'),
    nconf = require('nconf'),
    Q = require('Q');

function getQuestionData(qid){
     var deferred = Q.defer();
     root.child("questions/" + qid).on('value',function(snapshot){
        deferred.resolve(snapshot.val());
     });
     return deferred.promise;
};

function updateMeettime(snapshot) {

  var questionId = snapshot.name();
  var obj = snapshot.val();
  var num = snapshot.numChildren();
  var meetTime;

  getQuestionData(questionId).then(function(question){
    if(num >= question.signatures_threshold){

      var sortable = [];
       for(var key in obj){
           if(obj[key]['timestamp']){
              sortable.push({"timestamp":obj[key]['timestamp'],"user_id":key});
           }else{
              console.log("==== NO TIEMSTAMP ==== ");

           }
       }

       sortable.sort(function(a, b) {return a['timestamp'] - b['timestamp']});

       if(sortable.length>=500){
          meetTime =  sortable[499]['timestamp'];
       }else{
          console.log(" ! data incompelte ! qid:"+questionId+"  count: "+sortable.length);
          meetTime =  sortable[sortable.length-1]['timestamp'];
       }

       console.log(meetTime);
       root.child("questions/" + questionId + "/meet_timestamp").set(meetTime);

   }else{
       console.log("havent reach.");
   }

  });



};
function monitor(askkk) {
  root = askkk.root;
  root.child('signatures').on('child_added', function(snapshot){
     updateMeettime(snapshot);
  });
  root.child('signatures').on('child_changed', function(snapshot){
     updateMeettime(snapshot);
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
    updateMeettime(snapshot);
});
root.child('signatures').on('child_changed', function(snapshot){
    updateMeettime(snapshot);
});

*/