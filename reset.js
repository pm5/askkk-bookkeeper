var default_wait = 2000;
var default_timeout = 10000;

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

var fs = require('fs');

fs.readFile('test/signature/signatures.json', function (error, data) {
   root.child('signatures').remove();
   root.child('signatures').set(JSON.parse(data), function () {
     /* ----- */
     fs.readFile('test/signature/questions.json', function (error, data) {
       root.child('questions').remove();
       root.child('questions').set(JSON.parse(data), function () {
            console.log("Database reset complete.")

       });
     });
     /* ----- */
   });
});