/**
 * Module dependencies.
 */
var express = require('express');
//var connect = require('connect');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 1337;
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var passport = require('passport');
app.use(morgan('dev'));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        // Bypass browser's CORS options requests
        res.send(200);
    } else {
        // Pass to next layer of middleware
        next();
    }
});

app.use(passport.initialize());
var session = require('express-session');
require('./routes/modules/passport')(passport);
require('./routes/modules/jwtAuth.js')(app);

app.use(session({
    secret: 'wealllikeicecream' ,
    saveUninitialized: true,
    resave: true
}));

app.use(passport.session());

//Configuration
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json({ type: ['json','text/*'] }));
/*
app.use(bodyParser.json({
    maxBodySize: 65535,
    mapParams: false
}));*/



app.set('port', port);
require('./routes/routes.js')(app, io, passport);

//start server
http.listen(port , function () {
    console.log('Server running at ' + port);
});

