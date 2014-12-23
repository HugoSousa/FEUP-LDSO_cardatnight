var frisby = require('frisby');

var LOCALHOST_URL = "http://localhost:1337";
var SERVER_URL = "http://nightout-herokuapp.com";
var TEST = LOCALHOST_URL;
var TESTING_ESTABLISHMENT_ID = 6;
var db = require('./routes/modules/database.js');



frisby.create('set up')
.get(TEST)
.after(function(err, res, body) {

    db.addDoorman("testacc_porter","testacc_porter",TESTING_ESTABLISHMENT_ID, function (err, result) {
        if (err) console.log(err);
        else console.log('setup complete');
    });


})



//------------------------------------------------------- FAIL REGISTER
frisby.create('POST register account - fail test')
.post(TEST + '/register',
      {
    username: "testacc",
    password: "testacc"
},
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
.expectStatus(422)
.expectHeader('Content-Type', 'application/json; charset=utf-8')
.expectJSONTypes({
    error: String
})
.toss();


//------------------------------------------------------- REGISTER

frisby.create('POST register account - testacc')
.post(TEST + '/register',
      {
    username: "testacc",
    password: "testacc",
    name: "testacc",
    email:"testacc@testacc.com"
},
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
.expectStatus(200)
.expectHeader('Content-Type', 'application/json; charset=utf-8')
.expectJSON( {
    name: 'testacc',
    username: 'testacc',
    email: 'testacc@testacc.com',
    password: 'testacc',

})
.toss();

//------------------------------------------------------- LOGIN

frisby.create('POST login details')
.post(TEST + '/login',
      {
    username: "testacc",
    password: "testacc"
},
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
/*.inspectJSON()*/
.expectStatus(200)
.expectHeader('Content-Type', 'application/json; charset=utf-8')
.expectJSONTypes({
    access_token: String,
    exp: Number
})
.expectJSON('user',{
    name: 'testacc',
    email: 'testacc@testacc.com',
    deleted:false,
    username: 'testacc',
})
.after(function(err, res, body) {

    //------------------------------------------------------- CHECKLOGIN

    frisby.globalSetup({
        request: { 
            headers: { 'x-access-token': body.access_token }
        }
    });

    frisby.create('POST login details')
    .get(TEST + '/checklogin',
         {},
         { json: true },
         { headers: { 'Content-Type': 'application/json' }})
    /*.inspectJSON()*/
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json; charset=utf-8')
    .expectJSON({
        result: 'success'
    })
    .expectJSON('user',{
        name: 'testacc',
        email: 'testacc@testacc.com',
        deleted:false,
        username: 'testacc',
    })
    .toss();














})
.toss();
// - end LOGIN

//------------------------------------------------------- Database clear

frisby.create('wrap up')
.get(TEST)
.after(function(err, res, body) {
    db.permaDeleteAccount("testacc", function (err, result) {
        if (err) console.log(err);
        else  console.log('done cleaning data');
        toss();
    });
})
.toss()