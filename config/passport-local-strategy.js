const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('..//models/user');

// Authentication using passport
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.password !== password) {
        console.log(`Invalid Username/Password`);
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      console.log(`Error in finding the user --> Passport`);
      return done(err);
    }
  })
);

// Serializing the user which key is to be kept in cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log(`User not found with ID ${id}`);
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log(`Error in finding the user --> Passport`);
    return done(err);
  }
});

// Check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in,then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in
  return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the
    // locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
