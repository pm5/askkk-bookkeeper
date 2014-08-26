var askkk = require('./lib/askkk');
var question = require('./lib/question');
var user = require('./lib/user');

var signature = require('./lib/signature');
var priority_and_state = require('./lib/priority_and_state');
var addressed = require('./lib/addressed');
var meettime = require('./lib/meettime');

signature.monitor(askkk);
priority_and_state.monitor(askkk);
addressed.monitor(askkk);
meettime.monitor(askkk);
