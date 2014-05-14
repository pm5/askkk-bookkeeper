function monitor(root) {
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
}

module.exports.monitor = monitor;
