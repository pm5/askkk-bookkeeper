var askkk = require('./lib/askkk');
var question = require('./lib/question');
var user = require('./lib/user');

question.monitor(askkk);
user.monitor(askkk);
