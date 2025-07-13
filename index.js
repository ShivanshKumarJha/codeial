const express = require('express');
const app = express();
const logger = require('morgan');
const env = require('./config/environment');
const path = require('path');

const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;
require('./config/view-helpers')(app);

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const sassMiddleWare = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);

// Use environment-based port for chat server
const CHAT_PORT =
  process.env.CHAT_PORT ||
  (process.env.NODE_ENV === 'production' ? port : 5000);
chatServer.listen(CHAT_PORT);
console.log(`Chat server is listening on port ${CHAT_PORT}`);

// console.log(process.env.CODEIAL_ENVIRONMENT);
if (process.env.CODEIAL_ENVIRONMENT == 'development') {
  app.use(
    sassMiddleWare({
      src: './assets/scss',
      dest: './assets/css',
      debug: true,
      outputStyle: 'extended',
      prefix: '/css',
    })
  );
}
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('./assets'));
app.use(express.static(__dirname + '/public/assets'));

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(
  logger(process.env.MORGAN_MODE || 'combined', { stream: env.accessLogStream })
);

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    name: 'codeial',
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove: 'disabled',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});
