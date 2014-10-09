var jwt = require('jwt-simple');
var db = require('./database.js');

module.exports = function(app) {

    app.set("tokenSecret", "jwtlikesicecreamtoo");

    function jwtTokenAuthenticator(req, res, next) {
        var token = (req.body && req.body.access_token)
            || (req.query && req.query.access_token)
            || req.headers['x-access-token'];


        if (token) {
            try {
                var decoded = jwt.decode(token, app.get('tokenSecret'));

                if (decoded.exp <= Date.now()) {
                    return res.json(400, { error: "Access token has expired" });
                } else {
                    var username = decoded.username;
                    
                    db.getUser(username, "o Teste funcionou", function (err, user) {
                        if (err || !user)
                            return res.json(400, { error: err });
                        req.user = user;
                        return next();


                    });    

                  
                }

            } catch (err) {
                return res.status(400).json( {error: "Error parsing token", info : err});
            }
        } else {
            return res.json(400, {error: "Missing token"});
        }
    }

   // app.all("/api/restricted/*", jwtTokenAuthenticator);
    app.all("/testlogin", jwtTokenAuthenticator);

};
