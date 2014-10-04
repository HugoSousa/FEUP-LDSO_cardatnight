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
var bodyParser = require('body-parser')

//Configuration
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser({
    maxBodySize: 65535,
    mapParams: false
}));

app.set('port', port);

require('./routes/routes.js')(app, io);

//start server
http.listen(port , function () {
    console.log('Server running at ' + port);
});

