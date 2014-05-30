var askkk = require('./lib/askkk');
var question = require('./lib/question');
var user = require('./lib/user');

question.monitor(askkk.root);
user.monitor(askkk.root);
