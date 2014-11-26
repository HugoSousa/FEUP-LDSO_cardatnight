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
                    return res.status(400).json( { error: "Access token has expired" });
                } else {
                    var username = decoded.username;
                    
                    db.getUser(username, function (err, user) {
                        if (err || !user)
                            return res.status(400).json({ error: err });
                        delete user.password; // line can be removed, only here to avoid sending password back where it should no longer be needed
                        req.user = user;
                        return next();
                    });    

                  
                }

            } catch (err) {
                return res.status(400).json( {error: "Error parsing token", info : err});
            }
        } else {
            return res.status(400).json( {error: "Missing token"});
        }
    }

    // app.all("/api/restricted/*", jwtTokenAuthenticator);
    
    function permission_customer(req, res, next) {
        jwtTokenAuthenticator(req, res, function () {
            if (req.user.permission) return res.status(403).json({ error: "Permission denied" });
            else return next();
        });
    }
    function permission_manager(req, res, next) {
        jwtTokenAuthenticator(req, res, function () {
            if (!req.user.permission) return res.status(403).json({ error: "Permission denied" });
            else if (req.user.permission !== 'manager') return res.status(403).json({ error: "Permission denied" });
            else return next();
        });
    }
    function permission_employee(req, res, next) {
        jwtTokenAuthenticator(req, res, function () {
            if (!req.user.permission) return res.status(403).json({ error: "Permission denied" });
            else if (req.user.permission !== 'employee') return res.status(403).json({ error: "Permission denied" });
            else return next();
        });
    }
    function permission_employee_manager(req, res, next) {
        jwtTokenAuthenticator(req, res, function () {
            if (!req.user.permission) return res.status(403).json({ error: "Permission denied" });
            else if (req.user.permission !== 'employee' && req.user.permission !== 'manager') return res.status(403).json({ error: "Permission denied" });
            else return next();
        });
    }
    function permission_doorman(req, res, next) {
        jwtTokenAuthenticator(req, res, function () {
            if (!req.user.permission) return res.status(403).json({ error: "Permission denied" });
            else if (req.user.permission !== 'doorman') return res.status(403).json({ error: "Permission denied" });
            else return next();
        });
    }
    
    
    //mixed permission functions should be created if needed or employee/doorman modified if manager should have all permissions
    
    // testing routes for different login types ---------------------------------
    app.all("/testlogin_customer", permission_customer);
    app.all("/testlogin_manager", permission_manager);
    app.all("/testlogin_employee", permission_employee);
    app.all("/testlogin_doorman", permission_doorman);
    // ---------------------------
    
    // doorman/entry routes
	app.all("/requestentry", permission_customer);
    app.all("/requestexit", permission_customer);
	app.all("/gate/*", permission_doorman);

    //customer app routes
    app.all("/checklogin", permission_customer);
	app.all("/getcart", permission_customer);
    app.all("/order/*", permission_customer);
    app.all("/change-password",permission_customer);
    app.all("/delete-account",permission_customer);

    //manager/employee routes
    app.all("/delete-product",permission_manager);
    //  app.all("/add-product",permission_employee_manager);
    //  app.all("/edit-product",permission_employee_manager);

    //example: app.get("/orders/*",...

};
