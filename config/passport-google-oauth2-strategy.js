const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const env = require('dotenv').config();

const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: (process.env.NODE_ENV == 'production' ?
        process.env.PROD_URL : process.env.LOCAL_URL)
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        // find the user
        const user = await User.findOne({ email: profile.emails[0].value });

        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString('hex')
          });

          return done(null, newUser);
        }
      } catch (err) {
        console.log('error in google strategy-passport', err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
