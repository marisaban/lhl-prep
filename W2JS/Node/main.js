var fs = require("fs");

// fs.readFile('input.txt', function(err, data){
// 	if(err){
// 		return console.error(err);
// 	}
// 	console.log("Asynchronous read: " + data.toString());

// });

// console.log("Program Ended");

console.log("Going to open file");

fs.stat('input.txt', function(err, stats){
	if(err){
		return console.error(err);
	}
	console.log(stats);
	console.log("Got File info successfully");

	//check file type 

	console.log("isFile ? " + stats.isFile());
	console.log("isDirectory ?" + stats.isDirectory());
});