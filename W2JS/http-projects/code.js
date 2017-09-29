const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt        = require('bcrypt');

const app = express();

const urlDatabase = {};
const users = {};

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ["some secret here"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(function(req, res, next) {
  res.locals.userID = req.session.userID;
  res.locals.user = users[req.session.userID];
  next();
});

///////////////////////
// URL MGMT
///////////////////////


app.get("/urls", (req, res) => {
  let userID = req.session.userID;
  if (userID) {
    let templateVars = { urls: userSpecificURLS(userID) };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID:  req.session.userID
  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  let user_ID = req.session.userID;
  if (users[user_ID]) {
    res.render("urls_new");
  } else {
    res.status(401);
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let userID = req.session.userID;
  if (!userID) {
    res.status(401).send("You must <a href='/login'>login</a> first.");
  }

  let user = urlDatabase[req.params.id].userID;
  if (user === users[req.session.userID].id) {
    let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL};
    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("You must <a href='/login'>login</a> first!");
  }
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

///////////////////////
// USER AUTHENTICATION
///////////////////////

app.get("/register", (req, res) => {
  let userID = req.session.userID;
  let URLS = userSpecificURLS(userID);
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("register");
  }
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Email or password not entered.  Please <a href='/register'>try again</a>.");
    return;
  }
  const user = getUserByEmail(req.body.email)
  if (user) {
    res.status(400).send("Email is already taken.  Please <a href='/login'>login</a>.");
    return;
  } else {
    const randomID = generateRandomString(6);
    users[randomID] = {
      id:       randomID,
      email:    req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.userID = randomID;
    res.redirect("/urls/");
  }
});

app.post("/logout", (req, res) => {
  req.session = undefined;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  let userID = req.session.userID;
  if (userID) {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Invalid credentials. Please <a href='/login'>try again</a>!");
    return;
  }

  const user = authenticateUser(req.body.email, req.body.password);

  if (user) {
    req.session["userID"] = user.id;
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid credentials. Please <a href='/login'>try again</a>!");
  }
});


///////////////////////
// HELPERS
///////////////////////

function generateRandomString(length) {
  let text = "";
  let charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUWXYZ";

  for (let i = 0; i < length ; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}

function getUserByEmail(email) {
  for (let user in users) {
    if (users[user].email.toLowerCase().trim() === email.toLowerCase().trim()) {
      return users[user];
    }
  }
}

function authenticateUser(email, password) {
  const user = getUserByEmail(email);

  console.log('password 1', password);
  if (user) {
    console.log('password 2', user.password);
    if (bcrypt.compareSync(password, user.password)) {
      return user;
    }
  }
}

function userSpecificURLS(userID) {
  let result = {};
  for (let shortURL in urlDatabase) {
    let URL = urlDatabase[shortURL];
    if (userID === URL.userID) {
      result[shortURL] = URL;
    }
  }
  return result;
}

/////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});