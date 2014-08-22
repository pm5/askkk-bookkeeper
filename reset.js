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

var signatures_file_url = 'test/data/signatures.json';
var questions_file_url = 'test/data/questions.json';
var candidates_file_url = 'test/data/candidates.json';

fs.readFile(signatures_file_url, function (error, data) {
    root.child('signatures').remove();
    root.child('signatures').set(JSON.parse(data), function () {
      /* ----- */
      fs.readFile(questions_file_url, function (error, data) {
        root.child('questions').remove();
        root.child('questions').set(JSON.parse(data), function () {
               /* ----- */
               fs.readFile(candidates_file_url, function (error, data) {
                 root.child('candidates').remove();
                 root.child('candidates').set(JSON.parse(data), function () {
                      console.log("Reset database completed.")
                 });
               });
               /* ----- */
        });
      });
      /* ----- */
    });
});
