var fs = require('fs');

var signatures = {};
var index = 100000056894115;
var timestamp = 1408454098160;
for(var i=0;i<500;i++){

	var key = "facebook:" + index;
	var item = {};
	item[".priority"] = 1;
	item["timestamp"] = timestamp;
	signatures[key] = item;

    index++;
    timestamp++;

}
fs.writeFile("signatures_499.json", JSON.stringify(signatures), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log(" - File saved.");

    }
});
