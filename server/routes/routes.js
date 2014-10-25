
var path = require('path');
var db = require('./modules/database.js');
var validator = require('validator');
var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function (app, io, passport) {

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
        else if (!(validator.isEmail(email) && validator.isLength(email,0,64))) res.json( { error: 'Email not valid' });
        else if (!(validator.isLength(username,3,25) && !validator.contains(username,' '))) res.json( { error: 'Username not valid' });
		else if (!(validator.isLength(username,1,50))) res.json( { error: 'Invalid Name' });
        else {
            res.status(200);
            db.addCustomer(name, email, username, password, function (err, result) {
                if (err) res.status(409).json({ error: err });
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

    
    app.post('/login', function (req, res, next) {
    
        passport.authenticate('local-login', function (err, user, info) {
            if (err) return next(err);
            if (!user)
                {
    			if (info && info.message) return res.status(401).json( { error: "Missing Credentials" });
    				else return res.status(401).json( { error: info });
    			}
            
            var expires = moment().add(7,'days').valueOf();
            var token = generateToken(user.username, expires);
            res.status(200).json({
                access_token: token,
                exp: expires,
                user: user
            });

        })(req,res);
    });
	
	function generateToken(username, expirationDate) {
        var token = jwt.encode({
            username: username,
            exp: expirationDate
        }, app.get('tokenSecret'));
        
        return token;
    }


    app.post('/order', function (req, res) {

        var cartid = req.body.cartid;
        var productid = req.body.productid;
        var quantity = req.body.quantity;

        res.status(422);

        if (!cartid || !productid || !quantity ) res.json( { error: 'missing parameters' });
        else {
            res.status(200);

            db.addOrder('ordered', cartid, productid, quantity, function (err, result) {
                if (err) res.status(409).json(err);
                else res.status(200).json(result);

            });
        }
    });
	
	 app.post('/requestentry/:estabid', function (req, res) { //requested by customer to get access token
		
		db.getActiveCart(req.user, function(err, cart) {
			if (err) res.status(409).json({error: err});
			else {
			if (cart) res.status(409).json({error: "Customer already has an active card. Current cart ID [" + cart.cartid + "] of establishment nr " + cart.establishmentid});
			else {
				// generate entry token and return it
				res.status(200).json({token: "testtoken"});
			}
			}
			});
		
      
    });
	
	app.post('/getcart/:estabid', function (req, res) { // requested by customer to get cart
		
		db.getActiveCart(req.user, function(err, cart) {
			if (err) res.status(409).json({error: err});
			else {
				if (cart) res.status(200).json({status: 'valid' , cart: cart});
				else {
					res.status(200).json({error: 'no cart found', status: 'none'});
				}
			}
			});
    });
	
    app.get('/actualorders/:cartid', function (req, res) {

        db.getActualOrders(req.params.cartid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        })
    })

	app.post('/gate/entry/:token', function (req, res) {
		//check autentication of porter,etc
		//check token, get establishmentid, customerid
		//compare auth of porter with estabid in token
		//generate cart for user
		

      	res.json("TODO");
    });
	
	app.post('/gate/exit/:customerid', function (req, res) {
		//check estab id from auth
		//get active cart and mark as paid
		

		res.json("TODO");
    });
    
    app.get('/testlogin_customer', function (req, res, next) {
        res.status(200).json(req.user);
    
    });
    app.get('/testlogin_manager', function (req, res, next) {
        res.status(200).json(req.user);
    
    });
    app.get('/testlogin_employee', function (req, res, next) {
        res.status(200).json(req.user);
    
    });
    app.get('/testlogin_doorman', function (req, res, next) {
        res.status(200).json(req.user);
    
    });

    app.get('/products/:estabid', function(req, res){

        db.getProductsEstablishment(req.params.estabid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });

    });


    app.get('/product/:productid', function(req, res){

        db.getProduct(req.params.productid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });

    });    

    app.get('/incomingorders/:estabid', function(req, res){
        db.getIncomingOrders(req.params.estabid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });
    })

    app.post('/notify', function(req, res){

        var orderid = req.body.orderid;
        res.status(422);

        if (!orderid) res.json( { error: 'missing parameters' });
        //after changing database, send a message to the client devi
        db.notifyOrder(orderid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
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
