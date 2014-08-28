var CronJob = require('cron').CronJob;
var nconf = require('nconf');
var https = require('https');
function updateState() {

    var options = {
      hostname: 'ask-dev.firebaseio.com',
      port: 443,
      path: '/update.json',
      method: 'PUT'
    };

    var req = https.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    var data ='{"state": "updating state flag"}';
    req.write(data);
    req.end();

}
module.exports.run = updateState;
//updateState();

