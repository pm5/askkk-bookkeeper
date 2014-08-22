var root;
var now = Date.now();

//Priority and State
function updatePriority(snapshot) {

  var questionId = snapshot.name();

  if (snapshot.val().signatures_count >= snapshot.val().signatures_threshold) {// passed
      console.log(snapshot.val().title);
      console.log(snapshot.name() + ': o ' + snapshot.val().signatures_count);
      root.child("questions/" + questionId + "/state/passed").set("passed");
      root.child("questions/" + questionId + "/state/ended").remove();
      root.child("questions/" + questionId).setPriority(snapshot.val().signatures_count);

  } else {
    if (snapshot.val().deadline_timestamp > now) {// collecting

         root.child("questions/" + questionId).setPriority(snapshot.val().signatures_count);
         console.log(snapshot.name() + ': . ' + snapshot.val().signatures_count);
         root.child("questions/" + questionId).setPriority(snapshot.val().signatures_count);
         root.child("questions/" + questionId + "/state/collecting").set("collecting");
         root.child("questions/" + questionId + "/state/ended").remove();

    } else {//ended
         console.log(snapshot.name() + ': ! ' + snapshot.val().signatures_count);
         //add ended to state
         root.child("questions/" + questionId + "/state/ended").set("ended");
         root.child("questions/" + questionId).setPriority("ended." + snapshot.val().signatures_count );
    }

  }



};
function monitor(askkk) {
  root = askkk.root;
  root.child('questions').on('child_added', updatePriority);
  root.child('questions').on('child_changed', updatePriority);

};

module.exports.monitor = monitor;

//test
/*
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
root.child('questions').on('child_added', updatePriority);
root.child('questions').on('child_changed', updatePriority);
*/
