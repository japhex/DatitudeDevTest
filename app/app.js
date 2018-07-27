const express = require('express');
const engine = require('ejs-locals');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Import all routing/API files
const routes = require('./routes/index');
const app = express();
const expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

// Set body parser and public directory for static assets
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring passport
app.use(expressSession({secret: 'mySecretKey', cookie: {maxAge: 3600000}})); // Session lasts 1 hour.

// Instantiating routes and module route files
app.use('/', routes);

module.exports = app;
