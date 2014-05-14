var nconf = require('nconf');
nconf.file({ file: 'config/askkk-bookkeeper.json' })
  .defaults({
    "firebase": "https://askkkkk-dev.firebaseio.com/",
    "firebase_secret": "etZEKPiPhvkc7kKBoyAQDCe8vEr0ykp5nO5cMlgZ"
  });

var root = new (require('firebase'))(nconf.get('firebase'));
root.auth(nconf.get('firebase_secret'), function (error) {
  if (error) {
    console.log(error);
  }
});

root.child('count/questions').set(0, function (error) {
  if (error) {
    console.log(error);
  }
});
root.child('questions').on('child_added', function (snapshot) {
  root.child('count/questions').transaction(function (it) {
    return it + 1;
  }, function (error) {
    if (error) {
      console.log(error);
    }
  });
});
root.child('questions').on('child_removed', function (snapshot) {
  root.child('count/questions').transaction(function (it) {
    return it - 1;
  }, function (error) {
    if (error) {
      console.log(error);
    }
  });
});
