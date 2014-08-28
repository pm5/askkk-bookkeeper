var askkk = require('./lib/askkk');
var CronJob = require('cron').CronJob;

var signature = require('./lib/signature');
var priority_and_state = require('./lib/priority_and_state');
var addressed = require('./lib/addressed');
var meettime = require('./lib/meettime');

var update_state = require('./lib/update_state');

signature.monitor(askkk);
priority_and_state.monitor(askkk);
addressed.monitor(askkk);
meettime.monitor(askkk);

var job = new CronJob('26 * * * *', update_state.run);
job.start();
