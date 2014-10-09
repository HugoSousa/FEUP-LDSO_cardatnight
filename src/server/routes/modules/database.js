var pg = require('pg');

var database_url = process.env.DATABASE_URL || 'postgres://udkegzydszxlfg:abUNsyD0aHQV6KuVzDw2QUkNBN@ec2-54-83-204-244.compute-1.amazonaws.com:5432/d91a04g4tcaahe?ssl=true&pool=true';



exports.addCustomer = function (name, email , username , password, callback) { //Improvement to do: encapsulate in transaction
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connecto do database' }, null);
        }
        else {

                client.query({ text: "INSERT INTO person(username,password) VALUES( $1, $2) RETURNING personId", name: 'insert person', values: [username,password] }, function (err, result) {
                if (err) {
                    if (err.code == 23505) //username already exists (unique key constraint code)
                        callback({ error: "Username already exists" }, null);
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
    
};

exports.getProductsEstablishment = function (establishmentId, callback) {
    pg.connect(database_url , function (err, client, done) {
        if (err) {
            callback({ error: 'Failed to connecto do database' }, null);
        }
        else {

                client.query({ text: "SELECT * FROM product WHERE establishmentid = $1", name: 'get products establishment', values: [establishmentId] }, function (err, result) {
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
    
};