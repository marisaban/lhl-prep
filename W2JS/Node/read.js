var https = require('https');

var options = {
	host: 'stream-large-file.herokuapp.com',
	path: '/give-me-stuff-now'
};

// call by https when the request is made
var callback = function(response){
	console.log('In response handler callback');

	response.on('data', function(chunk){
		console.log('[-- CHUNK OF LENGTH ' + chunk.length + ' --]');
		console.log(chunk.toString());
	});

}

console.log("I'm about to make the request");

// .end() tacked onto the end of this request call 
https.request(options, callback).end();

console.log("I've made the request");