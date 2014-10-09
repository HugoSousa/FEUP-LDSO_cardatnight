var pg = require('pg');

var database_url = process.env.DATABASE_URL || 'postgres://udkegzydszxlfg:abUNsyD0aHQV6KuVzDw2QUkNBN@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d91a04g4tcaahe?ssl=true&pool=true';



exports.addCustomer = function (name, email , username , password, callback) { //Improvement to do: encapsulate in transaction
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback('Failed to connecto do database' , null);
        }
        else {

                client.query({ text: "INSERT INTO person(username,password) VALUES( $1, $2) RETURNING personId", name: 'insert person', values: [username,password] }, function (err, result) {
                if (err) {
                    if (err.code == 23505) //username already exists (unique key constraint code)
                        callback( "Username already exists" , null);
                    else callback(err, null);
                }
                else {
                    var id = result.rows[0].personid;

                    client.query({ text: "INSERT INTO customer(customerId,name,email) VALUES( $1, $2, $3)", name: 'insert customer', values: [id, name, email] }, function (err, result) {
                        if (err) callback({ error: err }, null);
                        else {                            
                            callback(null, {name: name, email: email, username: username, password: password});

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
                                data.id = id;
                                data.username = username;
                                data.password = result.rows[0].password;
                                if (!data || err) 
                                    callback(err, null);
                                else callback(null,data);

                            });
  
                        }
                    }
                });
            }
            
            done();
        });
        
        
    }
    



}


function getCustomerManagerData(client, id, callback) {

                              
    client.query({ text: "SELECT * FROM customer WHERE customerid = $1", name: 'get customer', values: [id] }, function (err, result) {
        if (err) callback(err, null);
        else {
            var customer = result.rows[0];

            if (customer) {
                delete customer.customerid;
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
