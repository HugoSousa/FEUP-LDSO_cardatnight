
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

	app.post('/delete-product', function (req, res) {

        var id = req.body.productid;

        res.status(422);

        if (!id ) res.json( { error: 'missing parameters' });
        else {
                res.status(200);

                db.deleteProduct(id, function (err, result) {
                    if (err) res.status(409).json(err);
                    else res.status(200).json(result);
                });
        }
    });
	
	
	app.post('/change-password', function (req, res) {

        var newPassword = req.body.newPassword;
        var username = req.user.username;
        
        res.status(422);

        if (!newPassword) res.json( { error: 'missing new password' });
        else {
       
                res.status(200);

                db.changePassword(username, newPassword, function (err, result) {
                    if (err) res.status(409).json({error: err});
                    else res.status(200).json({result: "success"});

                });
            
        }

    });

    app.post('/delete-account', function (req, res) {

        var username = req.user.username;

        db.deleteAccount(username, function (err, result) {
            if (err) res.status(409).json({error: err});
            else res.status(200).json({result: result});

        });
        

    });

    app.post('/add-product', function (req, res) {
        // TODO fix by using manager login
        var establishmentid = req.body.establishmentid;
        var categoryid = req.body.categoryid;
        var name = req.body.name;
		var description = req.body.description;
		var price = req.body.price;

        res.status(422);

        if (!categoryid || !establishmentid || !name || !price ) res.json( { error: 'missing parameters' });
        else {
            db.addProduct(establishmentid,description,name,price,categoryid, function (err, result) {
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
            var token = generateToken(user.id, user.username, expires);
            res.status(200).json({
                access_token: token,
                exp: expires,
                user: user
            });

        })(req,res);
    });
	
	function generateToken(userid, username, expirationDate) {
        var token = jwt.encode({
            userid: userid,
            username: username,
            exp: expirationDate
        }, app.get('tokenSecret'));
        
        return token;
    }


    app.post('/order', function (req, res) {

        var cartid = req.body.cartid;  // TODO usar getactivecart 
        var productid = req.body.productid;
        var quantity = req.body.quantity;

        res.status(422);

        if (!cartid || !productid || !quantity ) res.json( { error: 'missing parameters' });
        else {
            res.status(200);
            //buscar estabelecimento deste cart 
            db.getCartEstablishment(cartid, function (err1, result1) {
                if (err1) res.status(409).json(err1);

                else{
                    //console.log("ESTABLISHMENT: " + result1.rows[0].establishmentid);

                    //buscar passwords nao usadas no estabelecimento neste momento
                    db.getUnusedCodesByEstablishment(result1.rows[0].establishmentid, function (err2, result2) {
                        if (err2) res.status(409).json(err2);
                        else {
                            /*
                            for(var i = 0; i < result2.rows.length; i++){
                                console.log("AVAILABLE CODE: " + result2.rows[i].code);
                            }
                            */

                            //selecionar password aleatoria
                            var randomNumber = Math.floor((Math.random() * result2.rows.length));
                            var code = result2.rows[randomNumber].ordercodeid;

                            //console.log("SELECTED CODE: " + code);

                            db.addOrder('ordered', cartid, productid, quantity, code.toString(), function (err3, result3) {
                                if (err3) res.status(409).json(err3);
                                else res.status(200).json(result3);
                            });
                        }

                    });
                }
                    
            })    
        }
    });
	
	
	 app.get('/requestentry', function (req, res) { //requested by customer to get access token
		
		db.getActiveCart(req.user, function(err, cart) {
			if (err) res.status(409).json({error: err});
			else {
			if (cart) res.status(409).json({error: "Customer already has an active card. Current cart ID [" + cart.cartid + "] of establishment nr " + cart.establishmentid});
			else {
				// generate entry token and return it
                   var token = jwt.encode({
                        id: req.user.id,
                        exp: moment().add(5,'minutes').valueOf(),
                        type: "entry"
                    }, app.get('tokenSecret'));
				res.status(200).json({token: token});
			}
			}
			});
		
      
    });
    
    	 app.get('/requestexit', function (req, res) { //requested by customer to get exit token
		
		db.getPaidCart(req.user, function(err, cart) {
			if (err) res.status(409).json({error: err});
			else {
                if (cart) {
                    // generate entry token and return it
                       var token = jwt.encode({
                            id: req.user.id,
                            exp: moment().add(5,'minutes').valueOf(),
                            type: "exit"
                        }, app.get('tokenSecret'));
                    res.status(200).json({token: token});
                }
                else res.status(409).json({error: "Paid cart not found"});
			}
			});
		
      
    });
    
    
	
	app.get('/getcart', function (req, res) { // requested by customer to get cart
		

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
    });
    
    
    function decode(token, callback) {
        function onTick() {
            var decoded = jwt.decode(token, app.get('tokenSecret'))
            callback(decoded)
        }
        process.nextTick(onTick());
    }

    

	app.post('/gate/:token', function (req, res) {
        

        var decoded = jwt.decode(req.params.token, app.get('tokenSecret'));
        if (!decoded.id || !decoded.exp || !decoded.type) 
            res.status(409).json({error: "Invalid token, no data found" });
        else {
        if (decoded.exp <= Date.now()) {
                return res.status(400).json( { error: "Token has expired" });
            } else {
                
          var establishmentid = req.user.establishmentid;
          var customerid = decoded.id;
          var type = decoded.type;
                
        if (type !== "entry" && type !== "exit") res.status(409).json({error: "Invalid token type" });
        else   {     
           
            db.getActiveCart({id: customerid }, function(err, cart) {
                if (err) res.status(409).json({error: err});
                else {
                    if (cart) {
                        if (type === "entry")
                            res.status(409).json({error: 'Cart already found' });
                        else if (type === "exit") {
                            if (cart.paid && cart.paid == true) {
                                db.exitCart(establishmentid, customerid, function(err,result) {
                                    
                                 if (err) res.status(409).json({error: err});
                                    else res.status(200).json({result:result});
                                });
                                                                
                            }
                            else {
                                res.status(409).json({error: "Customer has not paid yet"});
                            }
                        }
                    }
                    else {
                        if (type === "entry") {
                          db.addActiveCart(establishmentid, customerid, function(err, cart) {
                           if (err) res.status(409).json({error: err});
                           else {
                            if (cart) res.status(200).json({status: 'valid' , cart: cart});
                            else {
                             res.status(200).json({error: 'no cart found', status: 'none'});
                            }
                           }
                           }); 
                        }
                        else if (type === "exit") {
                            res.status(409).json({error: "Cart not found"});
                        }
                    }
                }
                });  
            }
                          
        }
        }

    });
	
    app.get('/checklogin', function (req, res, next) {
        res.status(200).json({result: "success", "username": req.user.username});
    
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
	
    app.get('/customers/:estabid', function(req, res) {
        
        db.getCustomersEstablishment(req.params.estabid, function(err, result) {
            if (err) res.status(409).json(err);
            else {
                res.status(200).json(result);

            }
        });

    });
    app.get('/customer/:cartid', function(req, res) {
        db.getCustomerData(req.params.cartid, function(err, result) {
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });
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
    });

    app.get('/order/:orderid', function(req, res){
        db.getOrder(req.params.orderid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });
    });

    app.get('/customer_history', function(req, res){
        var customerid = req.user.id; 

        db.getUserHistory(customerid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });
        
    });

    app.get('/customer_history/:establishmentid', function(req, res){
        var customerid = req.user.id; 

        db.getUserHistoryByPlace(customerid, req.params.establishmentid, function(err, result){
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });
        
    });

    app.post('/notify', function(req, res){

        console.log("notify");
        var orderid = req.body.orderid;
        res.status(422);

        if (!orderid) res.json( { error: 'missing parameters' });
        //after changing database, send a message to the client device
        //get the username of the customer who ordered
        db.getUserOrder(orderid, function(err, result){
            if (err) res.status(409).json(err);
            
            else {

                //lookup for the socket of that username
                console.log("USER ID OF THIS ORDER: " + result.username);
                for(var a=0; a < clients.length; a++){
                    console.log("USERNAME: " + clients[a].username + "\n");
                    if(clients[a].username == result.username){
                        console.log("EMIT TO SOCKET " + clients[a].clientId);
                        var toSocket = clients[a].clientId;

                        //send the notified orderid
                        io.to(toSocket).emit('notify', orderid);
                    }
                }

                db.notifyOrder(orderid, function(err, result){
                    if (err) res.status(409).json(err);
                    else res.status(200).json(result);
                });
            }
        });
        
        //emit a notification to that socket

        
    });
	
    app.post('/deliver', function(req, res){

        var orderid = req.body.orderid;
        res.status(422);

        if (!orderid) res.json( { error: 'missing parameters' });
        else{
            db.deliverOrder(orderid, function(err, result){
                if (err) res.status(409).json(err);
                else res.status(200).json(result);
            });
        }   
    });


	app.post('/edit-product', function (req, res) {

        var productid = req.body.productid;
        var categoryid = req.body.categoryid;
        var name = req.body.name;
		var description = req.body.description;
		var price = req.body.price;

        res.status(422);

        if (!categoryid || !productid || !name || !price ) res.json( { error: 'missing parameters' });
        else {
            res.status(200);

            db.editProduct(productid,description,name,price,categoryid, function (err, result) {
                if (err) res.status(409).json(err);
                else res.status(200).json(result);

            });
        }
    });

    app.post('/delete-customer-consumption', function(req, res) {
        var cartid = req.body.cartId;
        console.log("Cart id=");
        console.log(cartid);
        db.deleteCustomerConsumption(cartid, function(err, result) {
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });

    });

    app.post('/mark-cart-paid/', function(req, res) {
        console.log(req.body);
        var cartid = req.body.cartId;
        console.log('Cart id='+cartid);
        db.markCartPaid(cartid, function(err, result) {
            if (err) res.status(409).json(err);
            else res.status(200).json(result);
        });

    });


    /*-----------------------------------------------------------------------------------*/
    /*--------------------------------------SOCKETS--------------------------------------*/
    /*-----------------------------------------------------------------------------------*/

    var clients = []

    io.on('connection', function (socket) {

        console.log('socket connected');

        socket.on('forceDisconnect', function(data){
            console.log("FORCE DISCONNECT: " + data.socket.id);
            socket.disconnect();

            var clientSocket = data.socket;
            for(var a=0; a < clients.length; a++){
                
                if(clients[a].clientId == clientSocket.id){
                    clients.splice(a,1);
                    break;
                }
            }
        })

        socket.on('storeClientInfo', function (data) {
            console.log("STORE CLIENT INFO");

            var clientInfo = new Object();
            clientInfo.username = data.username;
            clientInfo.clientId = socket.id;
            clients.push(clientInfo);

            printClients();
            
        });

        
        socket.on('removeClientInfo', function (data){
            console.log("REMOVE CLIENT INFO: " + data.socketid);

            //disconnect him by id
            if(typeof io.sockets.connected[data.socketid] !== "undefined")
                io.sockets.connected[data.socketid].disconnect();
            
            /*
            //remove from the array
            for(var a=0; a < clients.length; a++){
                
                if(clients[a].clientId == socketId){
                    clients.splice(a,1);
                    break;
                }
            }
            */
            //printClients();
        })
        
        socket.on('disconnect', function () {
            //remove the client from array
            for(var a=0; a < clients.length; a++){
                
                // FIX THIS result is undefined
                console.log("ID: " + clients[a].clientId);
                if(clients[a].clientId == socket.id){
                    console.log("REMOVE THIS FROM CLIENTS");
                    clients.splice(a,1);
                    break;
                }
            }


            console.log(socket.id);
            console.log('socket disconnected');
            printClients();

        });


        socket.emit('text', 'wow. such event. very real time.');
    });

    
    function printClients(){
        for(var i=0; i < clients.length; i++){
            console.log(i+1 + " - " + clients[i].username  + " -> " + clients[i].clientId);
            console.log("");
        }

        if(clients.length == 0)
            console.log("No clients! \n");
    }

    //http.listen(3000);

}
