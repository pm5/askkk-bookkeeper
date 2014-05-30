function monitor(root) {
  root.child('count/users').set(0);
  root.child('users').on('child_added', function (snapshot) {
    root.child('count/users').transaction(function (it) {
      return it + 1;
    }, function (error) {
      console.log(error);
    });
  });
}

exports.monitor = monitor
