const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// ____.____._____  Header , Payload , and Signature
let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'codeial',
};

passport.use(
  new JWTStrategy(opts, function (jwt_payload, done) {
    User.findById(jwtPayLoad._id, function (err, user) {
      if (err) {
        console.log('Error in finding user from JWT');
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
