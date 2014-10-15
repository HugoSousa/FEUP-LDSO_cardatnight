
var path = require('path');
var db = require('./modules/database.js');
var validator = require('validator');

module.exports = function (app, io) {

    // default route
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.post('/register', function (req, res) {

        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        res.status(422);
        if (!username || !password || !name || !email) res.json( { error: 'missing parameters' });
        else if (!(validator.isEmail(email) && validator.isLength(email,0,64))) res.json(422, { error: 'Email not valid' });
        else if (!(validator.isLength(username,3,25) && !validator.contains(username,' '))) res.json( { error: 'Username not valid' });
        else {
            res.status(200);
            db.addCustomer(name, email, username, password, function (err, result) {
                if (err) res.status(409).json(err);
                else res.status(200).json(result);

            });
        }

    });

    app.post('/change-password', function (req, res) {

        var username = req.body.username;
        var currentPassword = req.body.currentPassword;
        var newPassword = req.body.newPassword;
        var newPasswordRetyped = req.body.newPasswordRetyped;

        res.status(422);

        if (!username || !newPassword) res.json( { error: 'missing parameters' });
        else {
            if (newPassword != newPasswordRetyped) {
                res.json({ error: 'new password and new password retyped dont match!' });
            }
            else {
                res.status(200);

                db.changePassword(username, newPassword, function (err, result) {
                    if (err) res.status(409).json(err);
                    else res.status(200).json(result);

                });
            }
        }

    });

    app.post('/delete-account', function (req, res) {

        var username = req.body.username;

        res.status(422);

        if (!username) res.json( { error: 'missing parameters' });
        else {
            res.status(200);

            db.deleteAccount(username, function (err, result) {
                if (err) res.status(409).json(err);
                else res.status(200).json(result);

            });
        }

    });

    app.post('/order', function (req, res) {

        var cardid = req.body.cardid;
        var productid = req.body.productid;
        var quantity = req.body.quantity;

        res.status(422);

        if (!cardid || !productid || !quantity) res.json( { error: 'missing parameters' });
        else {
            res.status(200);

            db.addOrder(false, cardid, productid, quantity, function (err, result) {
                if (err) res.status(409).json(err);
                else res.status(200).json(result);

            });
        }

    });


    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });

        socket.on('chat message', function (msg) {
            io.emit('chat message', msg);
            console.log('message: ' + msg);
        });

    });

}
