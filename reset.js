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
var candidate_addressed_file_url = 'test/data/candidate_addressed.json';

root.child('candidate_addressed').remove();
root.child('questions').remove();
root.child('candidates').remove();
root.child('signatures').remove();

fs.readFile(candidate_addressed_file_url, function (error, data1) {

    root.child('candidate_addressed').set(JSON.parse(data1), function () {
      /* ----- */
      fs.readFile(questions_file_url, function (error, data2) {

        root.child('questions').set(JSON.parse(data2), function () {
               /* ----- */
               fs.readFile(candidates_file_url, function (error, data3) {

                 root.child('candidates').set(JSON.parse(data3), function () {

                           fs.readFile(signatures_file_url, function (error, data4) {

                                  root.child('signatures').set(JSON.parse(data4), function () {
                                      console.log("Reset database completed.")

                                  });
                            });


                 });
               });
               /* ----- */
        });
      });
      /* ----- */
    });
});
