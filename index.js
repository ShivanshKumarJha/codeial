const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const env = require('dotenv').config();
const port = process.env.PORT || 8000;
const CHAT_PORT = process.env.CHAT_PORT || 8001;

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

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(CHAT_PORT);
console.log(`Chat server is listening on port ${CHAT_PORT}`);

app.use(
  sassMiddleWare({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css',
  })
);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));

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
