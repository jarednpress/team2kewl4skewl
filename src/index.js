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
            // res.redirect(200, '/home');
            res.redirect('/home');
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
const getLatLong = async (cityname) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=${process.env.API_KEY_openweather}`;
  try {
    const response = await axios.get(url);
    const lat = response.data[0].lat;
    const long = response.data[0].lon;
    return [ lat, long ];
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getWeather = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY_openweather}`;
  try {
    const response = await axios.get(url);
    const temperature = response.data.list[0].main.temp;
    return temperature;
  } catch (error) {
    console.error(error);
    return null;
  }
}

app.get('/home', (req, res) => {
  res.render('pages/home.ejs')
});

const getToken = async (client_id, client_secret) => {
  const result = axios({
    url: `https://accounts.spotify.com/api/token`,
    method: 'POST',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      grant_type: 'client_credentials',
      client_id: client_id,
      client_secret: client_secret
    },
  })
    .then(results => {
      var access_token = results.data.access_token;
      //console.log(access_token);
      return access_token;
    })
    .catch(error => {
      return null;
    });
    return result;
}

const getTracks = async (fahrenheit, token) => {
  if (fahrenheit < 32) {
    var bars = "All the waves came moving, pushing us under water, But don't worry 'bout that..."
    var seed_artists = "5oLxJrktO7kOEJANS6nkZB";
    var seed_genres = "ambient,electronic,chill";
    var seed_tracks = "6qlWh52SoBOb6udnz3Xwxj";
  } else if (fahrenheit >= 32 && fahrenheit < 55) {
    var bars = "But I know, know that it's right, To listen to my breathing and start believing myself...";
    var seed_artists = "3l0CmX0FuQjFxr8SK7Vqag";
    var seed_genres = "alternative";
    var seed_tracks = "0c6xIDDpzE81m2q797ordA";
  } else if (fahrenheit >= 55 && fahrenheit < 70) {
    var bars = "It's time, you've come a long way, open the blinds let me see your face, you wouldn't be the first renegade to need somebody...";
    var seed_artists = "7gXy60xRcwYujBFoYHnR2O";
    var seed_genres = "folk,chill,pop";
    var seed_tracks = "73W5aXorr5vxrySFcoZqIN";
  } else { // f >= 70
    var bars = "Such a long time, I've been waitin' I've been waitin' for a long time...";
    var seed_artists = "246dkjvS1zLTtiykXe5h60";
    var seed_genres = "pop,hip-hop,happy";
    var seed_tracks = "05mDaV9Vb3wrzjF6OPZnhq";
  }
  const limit = 10;
  const market = "US";

  const result = axios({
    url: `https://api.spotify.com/v1/recommendations`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Accept': 'application/json',
      'Authorization': "Bearer " + token,
      'Content-Type': 'application/json'
    },
    params: {
      limit: limit,
      market: market,
      seed_artists: seed_artists,
      seed_genres: seed_genres,
      seed_tracks: seed_tracks
    },
  })
    .then(results => {
      var tracks = results.data.tracks;
      return tracks;
    })
    .catch(error => {
      return null;
    });
    return result;
}


app.get('/playlist', async (req, res) => {
  var city1_name = req.body.from;
  var city2_name = req.body.to;

  var token = await getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET); //return a string of the token only
  //var token = "BQCHS7h5Zt5-0vBS37VINrTYlqsj0hhJU-86yDIKOYw67kDjiO7QVq86ZsV1obOR10Ny1kA_ilHDDpfNuPxS65Yg6Exaj-jPgnzfUWmuQUviHW0pB9ee";
  
  var city1_latlong = await getLatLong(city1_name); //return an array with [lat_val, log_val]
  var city2_latlong = await getLatLong(city2_name);

  var city1_kelvin = await getWeather(city1_latlong[0], city1_latlong[1]); //return kelvin
  var city2_kelvin = await getWeather(city2_latlong[0], city2_latlong[1]);
  //var city1_kelvin = 302;
  //var city2_kelvin = 288;

  var city1_fahrenheit = (city1_kelvin-273.15)*(9/5)+32;
  var city2_fahrenheit = (city2_kelvin-273.15)*(9/5)+32;

  var city1_tracks = await getTracks(city1_fahrenheit, token);
  var city2_tracks = await getTracks(city2_fahrenheit, token);
  
  /* console.log("hello")
  console.log(city1_tracks)
  console.log(city2_tracks) */

  res.render("pages/playlist", {
    city1_tracks: city1_tracks,
    city2_tracks: city2_tracks
  })

})

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