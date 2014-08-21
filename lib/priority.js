var root;

function updatePriority(data) {

  var question = data.val();
  var questionId = data.name();

  console.log("[Update Priority To:]" + question.signatures_count +" ## QID:"+questionId);
  //root.child("questions/" + questionId).setPriority(questionId.signatures_count);

};
function monitor(askkk) {
  root = askkk.root;

  root.child('questions').on('child_added', updatePriority);
  root.child('questions').on('child_changed', updatePriority);

};

module.exports.monitor = monitor;


