const express 		= require("express");
const bodyParser 	= require("body-parser");


const app = express();
const urlDatabase = {};
const users = {};

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));


// URL MGMT

// add route handler for /urls
// use res.render() to pass URL data to your template
app.get("/urls", (req, res) => {
	let templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
	let templateVars = { shortURL: req.params.id };
	res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
});

// generate our shortURL by receiving POST request 
app.post("/urls", (req, res) => {
	console.log(req.body);	//debug statement to see POST parameters
	res.send("Ok");			// Respond with 'Ok' (we will replace this)
})

// route to handle shortURL requests
app.get("/u/:shortURL", (req, res) => {
	let longURL = urlDatabase[req.params.shortURL].longURL;
	res.redirect(longURL);
});


// Helpers 

function generateRandomString(){
	
}

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
