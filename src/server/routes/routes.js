
var path = require('path');
var db = require('./modules/database.js');

module.exports = function (app, io) {
    
    // default route
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    app.post('/register', function (req, res) {

        var username = req.body.username; // TODO CHECK PROPER REGEX EMAIL /USER/PW
        var password = req.body.password;
        var name = req.body.name;
        var email = req.body.email;
        if (!username || !password || !name || !email) res.json({error: 'missing parameters'}); 
        else
        db.addCustomer(name, email, username, password, function (err, result) {
                if (err) res.json(err);
                else res.json(result);

        });


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