
var path = require('path');
var register = require('./modules/register.js');

module.exports = function (app, io) {
    
    // default route
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    app.post('/register', function (req, res) {

        var email = req.body.email; // Getting the parameters
        var password = req.body.password;
        var error = 'Missing parameters';
        if (!email || !password) res.json(error); // TODO body is as json
        else res.json(register.register(email,password,null));
        /*
        register.useremail(email, password, function (found)
        {
            //Register function to perform register event
            console.log(found); // Prints the results in Console.(Optional)
            res.json(found); // Returns the result back to user in JSON format
        });
        */
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