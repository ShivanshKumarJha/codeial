const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('..//models/user');

// Authentication using passport
passport.use(new LocalStrategy({usernameField: 'email'},
async function (email, password, done) {
    try{
        const user = await User.findOne({ email: email });
        if (!user || user.password !== password) {
            console.log(`Invalid Username/Password`);
            return done(null, false);
        }
        return done(null, user);
    }
    catch(err){
        console.log(`Error in finding the user --> Passport`);
        return done(err);
    }
}));


// Serializing the user which key is to be kept in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
    try{
        const user = await User.findById(id);
        if(!user){
            console.log(`User not found with ID ${id}`);
            return done(null, false);
        }
        return done(null, user);
    }
    catch(err){
        console.log(`Error in finding the user --> Passport`);
        return done(err);
    }
});


module.exports = passport;