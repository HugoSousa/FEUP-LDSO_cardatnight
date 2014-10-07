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
var pg = require('pg');


var database_url = 'postgres://udkegzydszxlfg:abUNsyD0aHQV6KuVzDw2QUkNBN@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d91a04g4tcaahe?ssl=true&pool=true';

pg.connect(process.env.DATABASE_URL || database_url , function (err, client) {
    if (err) {
        return console.error('could not connect do posgres',err);   
    }
    else 
     {
        var query = client.query('SELECT * FROM customer WHERE name = \'Janet Rodriguez\'', function (err, result) {
            if (err) console.error('error getting x', err);
            else {
                console.log(result.rows);
            }
        });
        
       
    }
});





//Configuration
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));


app.use(bodyParser.json({ type: ['json','text/*'] }));
/*
app.use(bodyParser.json({
    maxBodySize: 65535,
    mapParams: false
}));*/


app.set('port', port);

require('./routes/routes.js')(app, io);

//start server
http.listen(port , function () {
    console.log('Server running at ' + port);
});

