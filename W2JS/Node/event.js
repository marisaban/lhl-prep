var events = require('events');

var eventEmitter = new events.EventEmitter();

// create an event handler as follows
var connectedHandler = function connected(){
	console.log('connection successful');

	// fire the data_received event
	eventEmitter.emit('data_received');
}

// bind the connection event with the handler
eventEmitter.on('connection', connectedHandler);

// bind the data_received event with the anon function
eventEmitter.on('data_received', function(){
	console.log('data received successfully');
});

eventEmitter.emit('connection');

console.log("program ended");