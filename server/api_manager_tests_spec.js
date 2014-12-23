var frisby = require('frisby');

var LOCALHOST_URL = "http://localhost:1337";
var SERVER_URL = "http://nightout-herokuapp.com";

var TEST = LOCALHOST_URL;

var db = require('./routes/modules/database.js');

//manager login
frisby.create('manager login')
  .post(TEST + '/login',
  {
    username: "TEST_MANAGER",
    password: "7073bea81f1cc958555aa20480a086250f40e15b99de1f5cdc862724d18114c9"
  },
  { json: true },
  { headers: { 'Content-Type': 'application/json' }})
  .expectStatus(200)
  .expectJSONTypes({ 
    'access_token': String, 
    'exp': Number
  })
  .expectJSON({ 
    'user':{
      'establishmentid': 6,
      'permission': 'manager',
      'id': 35,
      'username': 'TEST_MANAGER'
    }
  })

  .afterJSON(function (res) {

    var establishmentid = res.user.establishmentid;
    frisby.globalSetup({
      request: { 
        headers: { 'x-access-token': res.access_token }
      }
    });

    //get all products of establishment
    frisby.create('GET establishment products')
      .get(TEST + '/products/' + establishmentid)
      //.inspectJSON()
      .expectStatus(200)
      .expectJSON('*', {
          'productid': 35,
          'name': 'TEST_PRODUCT_1',
          'price': 1.5,
          'description': null,
          'category': 'cocktail',
          'image': ''
      })
    .toss();

    //create new product
    frisby.create('POST add product')
      .post(TEST + '/add-product',
      {
        establishmentid: establishmentid,
        categoryid: 2,
        name: 'TEST_PRODUCT_CREATION',
        description: 'TESTING CREATING A NEW PRODUCT ON THE TEST ESTABLISHMENT',
        price: 5.5
      },
      { json: true },
      { headers: { 'Content-Type': 'application/json' }})
      //.inspectJSON()
      .expectStatus(200)
      .expectJSONTypes({
        'productid': Number
      })
      //.inspectJSON()
      .afterJSON(function (res) {

        var added_product = res.productid;

        //create product with same name
        frisby.create('POST add product same name')
          .post(TEST + '/add-product',
          {
            establishmentid: establishmentid,
            categoryid: 1,
            name: 'TEST_PRODUCT_CREATION',
            description: 'SHOULDNT BE ABLE TO CREATE 2 PRODUCTS WITH SAME NAME',
            price: 6.5
          },
          { json: true },
          { headers: { 'Content-Type': 'application/json' }})
          .inspectJSON()
          .expectStatus(409)
          .toss()

        //edit the added product
        frisby.create('POST edit product')
          .post(TEST + '/edit-product',
          {
            productid: added_product,
            categoryid: 2,
            name: 'TEST_PRODUCT_CREATION',
            description: 'I AM EDITING THE DESCRIPTION AND PRICE OF THE PREVIOUSLY ADDED PRODUCT',
            price: 2.2
          },
          { json: true },
          { headers: { 'Content-Type': 'application/json' }})
          .inspectJSON()
          .expectStatus(200)
          .toss()
          
        //delete the added product - just adds a deleted flag, doesn't actually remove from the DB
         frisby.create('POST delete product')
          .post(TEST + '/delete-product',
          {
            productid: added_product,
          },
          { json: true },
          { headers: { 'Content-Type': 'application/json' }})
          .expectStatus(200)
          .after(function(err, res, body) {
            db.permanentDeleteProduct(added_product, function (err, result) {
              if (err) console.log(err);
            });
          })
          .toss();
          
      })
      .toss()
    })
  .toss();
