const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
// callback receives request and response arguments. We read values from the request 
// then send a string back to the client using the response object
function requestHandler(request, response){
	if(request.url == '/'){
		response.end("Welcome!");
	}else if (request.url == '/urls'){
		response.end("www.lighthouselabs.ca/nwww.google.com");
	}else {
		response.statusCode = 404;
		response.end("Unknown Path");
	}
}

var server = http.createServer(requestHandler);

server.listen(PORT, () => {
	console.log(`Server listening on: http://localhost: ${PORT}`);
});

