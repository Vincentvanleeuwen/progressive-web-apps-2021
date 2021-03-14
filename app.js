/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express'); // Express web server framework
const handlebars = require('express-handlebars');

const cors = require('cors');

const cookieParser = require('cookie-parser');
require('dotenv').config()
const port = process.env.PORT;


const app = express();

// Require the routes
const login = require('./routes/login');
const callback = require('./routes/callback');
const create = require('./routes/create');


// Assign handlebars as the view engine
app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
}))

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser())
  .use('/', login)
  .use('/callback', callback)
  .use('/create', create)

console.log(`Listening on ${port}`);
app.listen(port);
