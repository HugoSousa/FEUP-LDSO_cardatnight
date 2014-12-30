var pg = require('pg');

var database_url = process.env.DATABASE_URL || 'postgres://udkegzydszxlfg:abUNsyD0aHQV6KuVzDw2QUkNBN@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d91a04g4tcaahe?ssl=true&pool=true';


exports.addCustomer = function (name, email , username , password, callback)
{
    var rollback = function(client, done, callback, error, result) {
        client.query('ROLLBACK',function(err) {
            if (err) error = 'database error on rollback';
            callback(error,result);
            return done(err);
        });
    };
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback('Failed to connecto do database' , null);
        }
        else {
            client.query('BEGIN', function (err) {
                if (err) return rollback(client,done, callback, "Unknown database error. Try again later." , null);
                else {

                    client.query({ text: "INSERT INTO person(username,password) VALUES( $1, $2) RETURNING personId", name: 'insert_person', values: [username,password] }, function (err, result) {
                        if (err) {
                            if (err.code == 23505) //username already exists (unique key constraint code)
                                rollback(client,done, callback,"Username already exists" , null);
                            else rollback(client,done, callback,err, null);
                        }
                        else {
                            process.nextTick(function() {
                                var id = result.rows[0].personid;

                                client.query({ text: "INSERT INTO customer(customerId,name,email) VALUES( $1, $2, $3)", name: 'insert_customer', values: [id, name, email] }, function (err, result) {
                                    if (err) {

                                        if (err.code == 23505) //username already exists (unique key constraint code)
                                            rollback(client,done,callback,"Email already exists", null);
                                        else  rollback(client,done,callback,err, null);

                                    }
                                    else {
                                        client.query('COMMIT', done);
                                        callback(null, { name: name, email: email, username: username, password: password });

                                    }
                                });
                            });

                        }
                    });
                }
            });
        }

        done();
    });

}   


exports.addDoorman = function ( username , password, establishmentid, callback)
{
    var rollback = function(client, done, callback, error, result) {
        client.query('ROLLBACK',function(err) {
            if (err) error = 'database error on rollback';
            callback(error,result);
            return done(err);
        });
    };
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback('Failed to connecto do database' , null);
        }
        else {
            client.query('BEGIN', function (err) {
                if (err) return rollback(client,done, callback, "Unknown database error. Try again later." , null);
                else {

                    client.query({ text: "INSERT INTO person(username,password) VALUES( $1, $2) RETURNING personId", name: 'insert_person', values: [username,password] }, function (err, result) {
                        if (err) {
                            if (err.code == 23505) //username already exists (unique key constraint code)
                                rollback(client,done, callback,"Username already exists" , null);
                            else rollback(client,done, callback,err, null);
                        }
                        else {
                            process.nextTick(function() {
                                var id = result.rows[0].personid;

                                client.query({ text: "INSERT INTO worker(workerId,establishmentId,permission) VALUES( $1, $2, $3)", name: 'insert_customer', values: [id, establishmentid, 'doorman'] }, function (err, result) {
                                    if (err) {

                                        if (err.code == 23505) //username already exists (unique key constraint code)
                                            rollback(client,done,callback,"Email already exists", null);
                                        else  rollback(client,done,callback,err, null);

                                    }
                                    else {
                                        client.query('COMMIT', done);
                                        callback(null, { name: name, email: email, username: username, password: password });

                                    }
                                });
                            });

                        }
                    });
                }
            });
        }

        done();
    });

}    
exports.getUser = function (username, callback) {

    if (!username) callback("No username provided" , null);
    else {
        pg.connect(database_url , function (err, client, done) {
            if (err) {
                callback( 'Failed to connecto do database' , null);
            }
            else {

                client.query({ text: "SELECT * FROM person WHERE username = $1", name: 'get person', values: [username] }, function (err, result) {
                    if (err) {                    
                        callback( err , null);
                    }
                    else {
                        if (!result.rows[0]) {
                            callback( "User not found" , null);
                        }
                        else {
                            var id = result.rows[0].personid;
                            getCustomerManagerData(client, id, function (err, data) {

                                if (!data || err) 
                                    callback(err, null);
                                else {
                                    data.id = id;
                                    data.username = username;
                                    data.password = result.rows[0].password;
                                    callback(null,data);
                                }

                            });

                        }
                    }
                });
            }

            done();
        });


    }
}

exports.getActiveCart = function(user, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            var id = user.id;
            client.query({text: "select * from cart, establishment where exittime is null and customerid = $1 and cart.establishmentid = establishment.establishmentid", name: 'get active cart', values: [id]}, function (err, result) {
                if (err) {
                    callback( err , null);
                }
                else {
                    callback( null , result.rows[0]);
                }


            });

        }

        done();
    });

}


exports.getPaidCart = function(user, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            var id = user.id;
            client.query({text: "select * from cart where paid = true and customerid = $1 and exittime is null", name: 'getpaidcart', values: [id]}, function (err, result) {

                if (err) {
                    callback( err , null);
                }
                else {
                    callback( null , result.rows[0]);
                }


            });

        }

        done();
    });

}

exports.addActiveCart = function(establishmentid, customerid, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({text: "insert into cart(balance,credit,exittime,paid,establishmentid,customerid,qrcode) values (0,0,null,'false',$1,$2,'')", 
                          values: [establishmentid,customerid] }, function (err, result) {

                if (err) {
                    callback( err , null);
                }
                else {
                    callback( null , result);
                }


            });

        }

        done();
    });

}

exports.exitCart = function(establishmentid, customerid, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({text: "UPDATE cart SET exittime = now() WHERE establishmentid = $1 and customerid =$2 and paid=true and exittime is null", 
                          values: [establishmentid,customerid] }, function (err, result) {
                if (err) {
                    callback( err , null);
                }
                else {
                    callback( null , "success");
                }

            });

        }

        done();
    });

}

exports.addProduct = function (establishmentid,description,name,price,categoryid, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "insert into product(productid, description,image,name,price,establishmentid,categoryid) values (DEFAULT, $1,'',$2,$3,$4,$5) RETURNING productid",
                          values: [description,name,price,establishmentid,categoryid] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, result.rows[0]);
                }

            });
        }

        done();
    });

}

exports.changePassword = function (username, newPassword, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "UPDATE person SET password=$2 WHERE username=$1", name: 'update person', values: [username, newPassword] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });

}

exports.deleteAccount = function (username, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "UPDATE customer SET deleted = true WHERE customerid=(select personid from person where username = $1)", name: 'delete person', values: [username] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, "successfully deleted the account");
                }

            });
        }

        done();
    });

}

exports.permaDeleteAccount = function (username, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "DELETE FROM customer WHERE customerid=(select personid from person where username = $1)", name: 'perma delete customer', values: [username] }, function (err, result) {

                if (err) {
                    callback(err , null);

                }
                else {
                    client.query({ text: "DELETE FROM person WHERE username = $1", name: 'perma delete customer', name: 'perma delete person', values: [username] }, function (err, result) {
                        if (err) {                    
                            callback(err , null);

                        }
                        else {
                            callback(null , result);
                        }

                    });
                }

            });
        }

        done();
    });

}

exports.deleteProduct = function (id, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "UPDATE product SET deleted = true WHERE productid=$1", values: [id] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });

}



exports.addOrder = function (orderstate, cartid, productid, quantity, code, callback) {
    pg.connect(database_url , function (err, client, done) {

        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            console.log("BEFORE QUERY -> CODE: " + code);
            client.query({ text: "INSERT INTO orders(orderstate, cartid, productid, quantity, ordercodeid) VALUES($1, $2, $3, $4, $5) RETURNING ordersid", name: 'insert orders', values: [orderstate, cartid, productid, quantity, code] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, result.rows[0]);
                }

            });
        }

        done();
    });

}

exports.getCustomersEstablishment=function(establishmentid,callback) {

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({text: "SELECT DISTINCT CUSTOMER.NAME AS NAME,CUSTOMER.EMAIL AS EMAIL,CART.* FROM CUSTOMER,CART,ESTABLISHMENT WHERE CART.ESTABLISHMENTID= $1 AND CART.CUSTOMERID=CUSTOMER.CUSTOMERID",name: "get customers",values:[establishmentid]}, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }

        done();
    });

}

exports.getCartData=function(cartId, callback) {
    console.log(cartId);
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({text: "SELECT customer.name,cart.* FROM customer,cart WHERE cart.cartid = $1 and customer.customerid=cart.customerid",name: "get customer cart",values:[cartId]}, function (err, result) {
            if (err) {
                //any specific error?
                callback({ error: "Error occurred" }, null);
            }
          else {
           var resultArray=[];
            console.log(result.rows[0]);
           resultArray[0]=result.rows[0];
           resultArray[1]=0;
           if(!resultArray[0].length>0)
            client.query({text: "SELECT PRODUCT.PRODUCTID,PRODUCT.NAME,ORDERS.QUANTITY,PRODUCT.PRICE FROM PRODUCT,ORDERS WHERE ORDERS.CARTID= $1 and ORDERS.PRODUCTID=PRODUCT.PRODUCTID",name: "get cart",values:[cartId]}, function (err, result)
           {
            if(err)
                callback({ error: "Error occurred" }, null);
            else
            {
                resultArray[1]=result.rows;
                callback(null, resultArray);
            }
    
           });
            else
             callback(null, resultArray);   
            }
          });
        }
        
        done();
    });
    
}

exports.getCustomerData=function(customerid, callback) {
    console.log(customerid);
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({text: "SELECT * FROM customer WHERE customerid= $1 ",name: "get customer data",values:[customerid]}, function (err, result) {
            if (err) {
                //any specific error?
                callback({ error: "Error occurred" }, null);
            }
          else {
              console.log(result.rows);
              callback(null,result.rows);
          }        
        done();
    });
    
}
    });
}
               

exports.getCustomerHistory = function (customerId, establishmentId,callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {

            client.query({ text: "SELECT balance,entrancetime from cart where cart.customerid=$1 and cart.establishmentid=$2", name: 'get customer history', values: [customerId,establishmentId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback(err, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }

        done();
    });

}

exports.deleteCustomerConsumption = function(cartId,callback){
    console.log('Final Cart id = ');
    console.log(cartId);
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "DELETE FROM ORDERS WHERE CARTID=$1;", name: 'deleteConsumption', values: [cartId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    client.query({ text: "DELETE FROM CART WHERE CARTID=$1;", name: 'deleteConsumptionCart', values: [cartId] }, function(err,result){
                        if(err){
                            callback({ error: "Error occurred" }, null);
                        }
                        else
                        {
                            callback(null, {success: "Cart " + cartId + "'s consumption has successully been deleted"});
                        }
                    });
                }
            });
        }

        done();
    });
}

exports.markCartPaid = function(cartId,callback){
    var paid=true;
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "UPDATE CART SET PAID = $1 WHERE CARTID=$2;", name: 'markCartPaid', values: [paid,cartId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, {success: "Cart " + cartId + " has successully been paid"});
                }
            });
        }

        done();
    });
}

function getCustomerManagerData(client, id, callback) {


    client.query({ text: "SELECT * FROM customer WHERE customerid = $1", name: 'get customer', values: [id] }, function (err, result) {
        if (err) callback(err, null);
        else {
            var customer = result.rows[0];

            if (customer) {
                delete customer.customerid;
                if (customer.deleted) 
                    callback("This account has been deleted", null);
                else
                    callback(null, customer);
            }
            else {
                client.query({ text: "SELECT * FROM worker WHERE workerid = $1", name: 'get worker', values: [id] }, function (err, result) {
                    if (err) callback(err, null);
                    else {
                        var worker = result.rows[0];

                        if (worker) {
                            delete worker.workerid;
                            callback(null, worker);
                        }
                        else callback("person not customer nor worker", null);

                    }
                });
            }

        }
    });

}    

exports.getIncomingOrders = function (establishmentId, callback) {

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "SELECT *, product.name, ordercode.code as productname FROM orders, cart, establishment, product, ordercode WHERE orders.cartid = cart.cartid AND orders.ordercodeid = ordercode.ordercodeid AND cart.establishmentid = establishment.establishmentid AND orders.productid = product.productid AND cart.establishmentid = $1 AND orders.orderstate != 'delivered'  ORDER BY orders.orderstime", name: 'getincomingorders', values: [establishmentId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }

        done();
    });
}

exports.getOrder = function (orderId, callback) {

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "SELECT orderstime, orderstate, quantity, ordercode.code, product.name AS productname, product.price * orders.quantity AS price FROM orders, product, ordercode WHERE orders.productid = product.productid AND orders.ordercodeid = ordercode.ordercodeid AND orders.ordersid = $1", name: 'getorder', values: [orderId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows[0]);
                }
            });
        }

        done();
    });
}


exports.getUserOrder = function (orderId, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "SELECT ordercode.code, person.personid, person.username FROM orders, cart, customer, person, ordercode WHERE orders.ordercodeid = ordercode.ordercodeid AND cart.cartid = orders.cartid AND customer.customerid = cart.customerid AND person.personid = customer.customerid AND orders.ordersid = $1", name: 'userorder', values: [orderId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows[0]);
                }
            });
        }

        done();
    });
}

exports.notifyOrder = function (orderId, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "UPDATE orders SET orderstate = 'notified' WHERE ordersid = $1", name: 'notifyorder', values: [orderId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, {success: "Order " + orderId + " has successully been notified"});
                }
            });
        }

        done();
    });
}

exports.deliverOrder = function (orderId, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "UPDATE orders SET orderstate = 'delivered' WHERE ordersid = $1", name: 'deliverorder', values: [orderId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, {success: "Order " + orderId + " has successully been delivered", result: result});
                }
            });
        }

        done();
    });
}

exports.getProductsEstablishment = function (establishmentId, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {
            client.query({ text: "SELECT product.productid, product.name, price, description, category.name as category, image FROM product, category WHERE product.categoryid = category.categoryid AND establishmentid = $1 AND product.deleted = false", name: 'get products establishment', values: [establishmentId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }
        done();
    });

}

exports.getProduct = function (productId, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {

            client.query({ text: "SELECT * FROM product WHERE productid = $1", name: 'get product', values: [productId] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback({ error: "Error occurred" }, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }

        done();
    });

}

exports.getProductHistory = function (productId, establishmentId, days, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect do database' }, null);
        }
        else {

            client.query({ text: "SELECT i AS salesdate, COALESCE(count, 0) AS sales FROM generate_series(current_date - $3::int, current_date, '1 day'::interval) i LEFT JOIN (SELECT date_trunc('day',orders.orderstime) AS date, product.productid, COUNT(*) FROM orders, product, establishment WHERE product.establishmentid = establishment.establishmentid AND orders.orderstime::date > current_date - interval \'$3\' day AND orders.productid = product.productid AND product.productid = $1 AND establishment.establishmentid = $2 AND deleted = false GROUP BY orders.orderstime, product.productid ORDER BY orders.orderstime) a ON i = a.date", name: 'get product history', values: [productId, establishmentId, days] }, function (err, result) {
                if (err) {
                    //any specific error?
                    callback(err, null);
                }
                else {
                    callback(null, result.rows);
                }
            });
        }

        done();
    });

}

exports.getActualOrders = function(cartid, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({text: "SELECT ordersid, orderstime, orderstate, ordercode.code, product.price * orders.quantity AS price FROM orders, product, ordercode WHERE orders.productid = product.productid AND ordercode.ordercodeid = orders.ordercodeid AND orders.cartid = $1 ORDER BY orders.orderstime DESC", name: 'getactualorders', values: [cartid]}, function (err, result) {
                if (err) {                    
                    callback( err , null);
                }
                else {
                    callback( null , result.rows);   
                }

            });

        }

        done();
    });
}

exports.editProduct = function (id,description,name,price,categoryid, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "UPDATE product set description=$1, name=$2, price=$3, categoryid=$4 where productid=$5",
                          values: [description,name,price,categoryid,id] }, function (err, result) {

                if (err) {                    
                    callback(err , null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });

}


exports.getUnusedCodesByEstablishment = function (establishmentId, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "SELECT ordercodeid, code FROM ordercode EXCEPT SELECT ordercode.ordercodeid, ordercode.code FROM ordercode, orders, cart, establishment WHERE orders.ordercodeid = ordercode.ordercodeid AND orders.cartid = cart.cartid AND cart.establishmentid = establishment.establishmentid AND cart.establishmentid = $1 AND orders.orderstate != 'delivered'",
                          values: [establishmentId] }, function (err, result) {

                if (err) {                    
                    callback(err, null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });

}

exports.getCartEstablishment = function (cartId, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "SELECT cart.establishmentid FROM cart, establishment WHERE cart.establishmentid = establishment.establishmentid AND cart.cartid = $1",
                          values: [cartId] }, function (err, result) {

                if (err) {                    
                    callback(err, null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });

}


exports.getUserHistory = function (customerid, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "SELECT to_char(date_trunc('day',cart.entrancetime), 'DD/MM/YYYY') AS date, SUM(cart.balance) AS price, establishment.establishmentid, establishment.name AS establishmentname FROM cart, customer, establishment WHERE cart.establishmentid = establishment.establishmentid AND cart.customerid = customer.customerid AND customer.customerid = $1 GROUP BY date_trunc('day',cart.entrancetime), establishment.establishmentid ORDER BY date_trunc('day',cart.entrancetime);",
                          values: [customerid] }, function (err, result) {

                if (err) {                    
                    callback(err, null);
                }
                else {
                    callback(null, result);
                }

            });
        }

        done();
    });
}

exports.getUserHistoryByPlace = function (customerid, establishmentid, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "SELECT to_char(date_trunc('day',cart.entrancetime), 'DD/MM/YYYY') AS date, SUM(cart.balance) AS price, establishment.establishmentid, establishment.name AS establishmentname FROM cart, customer, establishment WHERE cart.establishmentid = establishment.establishmentid AND cart.customerid = customer.customerid AND customer.customerid = $1 AND establishment.establishmentid = $2 GROUP BY date_trunc('day',cart.entrancetime), establishment.establishmentid ORDER BY date_trunc('day',cart.entrancetime);",
                          values: [customerid, establishmentid] }, function (err, result) {

                if (err) {                    
                    callback(err, null);
                }
                else {
                    callback(null, result);
                }

            });
        }
        done();
    });
}

exports.permanentDeleteProduct = function (productId, callback){

    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connect to database' }, null);
        }
        else {
            client.query({ text: "DELETE FROM product WHERE productid = $1",
                          values: [productId] }, function (err, result) {

                if (err) {                    
                    callback(err, null);
                }
                else {
                    callback(null, result);
                }

            });
        }
        done();
    });
}