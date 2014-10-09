// routes/modules/passport.js

var LocalStrategy = require('passport-local').Strategy;
var db = require('./database.js');

module.exports = function (passport) {
    
    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });
    
    passport.deserializeUser(function (username, done) {
        User.findById(username, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
        
        db.getUser(username, function (err, user) {
            if (err || !user)
                return done(null, false, err);
            else {
                
                if (user.password !== password)
                    return done(null, false, "Wrong password.");
                else {
                    delete user.password; // line can be removed, only here to avoid sending password back where it should no longer be needed
                    return done(null, user);
                }
            }

            });
        
        }));

  
};
