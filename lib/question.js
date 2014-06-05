function monitor(askkk) {
  var root = askkk.root;

  root.child('categories').set(null, function (error) { if (error) console.log(error); });
  root.child('count/questions').set(0, function (error) { if (error) console.log(error); });
  root.child('count/categories').set(null, function (error) { if (error) console.log(error); });

  root.child('questions').on('child_added', function (snapshot) {
    root.child('count/questions').transaction(function (it) {
      return it + 1;
    }, function (error) { if (error) console.log(error); });

    for (var i in snapshot.val().category) {
      root.child('count/categories/' + snapshot.val().category[i]).transaction(function (it) {
        return it + 1;
      });
      root.child('categories/' + askkk.category_groups[snapshot.val().category[i]] + '/' + snapshot.name()).set(true);
    }
  });

  root.child('questions').on('child_removed', function (snapshot) {
    root.child('count/questions').transaction(function (it) {
      return it - 1;
    }, function (error) { if (error) console.log(error); });
  });
}

module.exports.monitor = monitor;
