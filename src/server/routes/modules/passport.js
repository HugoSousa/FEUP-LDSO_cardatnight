// routes/modules/passport.js

var LocalStrategy = require('passport-local').Strategy;
var db = require('./database.js');

module.exports = function (passport) {
    
    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });
    
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
        
        db.getUser(username, password, function (err, user) { 
                if (err || !user)
                    return done(null, false, err);
                else return done(null, user);
            

            });
        
        }));

  
};
