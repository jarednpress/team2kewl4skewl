// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

app.get('/welcome', (req, res) => {
  res.render('pages/welcome.ejs');
});

app.get('/', (req, res) => {
  //res.redirect('/login'); 
  res.redirect('/welcome'); 
});

// app.get('/home', (req, res) => {
//   res.redirect('/login'); 
// });

app.get('/login', (req, res) => {
  res.render('pages/login.ejs');
});

app.get('/register', (req, res) => {
  res.render('pages/register.ejs')
});

app.get('/playlist', (req, res) => {
  res.render('pages/playlist.ejs')
});

app.post('/login', async (req, res) => {
  const username = req.body.username;
  const query = 'select password from users where username = $1;';
  db.any(query, username)
    .then(async function (data) {
      if(data[0]){
        const match = await bcrypt.compare(req.body.password, data[0].password);
        if (match) {
          req.session.user = {
            username: username
          }
          res.redirect(200, '/home');
        } else { 
          res.render('pages/login.ejs', {
            message: "Incorrect Username or Password"
          })
        }
      }
      else {
        res.render('pages/register.ejs', {
          message: "User not found, please register"
        })

      }
    })
    .catch(function (err) {
      res.render("pages/login", {
        message: err
      })
    });
});

app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  console.log(req.body.username)
  const hash = await bcrypt.hash(req.body.password, 10);
  const username = req.body.username;

  // To-DO: Insert username and hashed password into 'users' table
  const query = "insert into users (username, password) values ($1, $2);";

  db.any(query, [username, hash])
  .then(function (data) {
    res.redirect('/login')
  })
  .catch(function (err) { //redirect to get register route
    res.redirect('/register')
  });
});


// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};



// Authentication Required
// app.use(auth);

app.get('/home', (req, res) => {
  res.render('pages/home.ejs')
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/welcome", {
    message: "Logged out Successfully"
  });
});

app.get('/playlist', (req,res) => {
  res.render('pages/playlist.ejs')
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});