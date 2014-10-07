DROP TABLE IF EXISTS OrdersProduct;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS worker;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS Establishment;

CREATE TABLE Establishment(
   establishmentId SERIAL PRIMARY KEY NOT NULL,
   name TEXT NOT NULL
);

CREATE TABLE person(
   personId SERIAL PRIMARY KEY NOT NULL,
   username TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL
);

CREATE TABLE customer(
   customerId SERIAL PRIMARY KEY NOT NULL,
   name TEXT NOT NULL,
   email TEXT NOT NULL,
   FOREIGN KEY (customerId) REFERENCES person(personId)
);

CREATE TYPE worker_permission AS ENUM ('employee', 'manager', 'porter');
CREATE TABLE worker(
   workerId SERIAL PRIMARY KEY NOT NULL,
   establishmentId SERIAL NOT NULL,
   permission worker_permission,
   FOREIGN KEY (workerId) REFERENCES person(personId),
   FOREIGN KEY (establishmentId) REFERENCES Establishment(establishmentId)
   
);

CREATE TABLE Cart(
   cartId SERIAL PRIMARY KEY NOT NULL,
   balance DOUBLE PRECISION CHECK (balance >= 0),
   credit DOUBLE PRECISION CHECK (credit >= 0),
   entranceTime TIMESTAMP DEFAULT current_timestamp,
   exitTime TIMESTAMP,
   paid BOOLEAN NOT NULL,
   establishmentId INT NOT NULL,
   customerId INT NOT NULL,
   FOREIGN KEY (establishmentId) REFERENCES Establishment(establishmentId),
   FOREIGN KEY (customerId) REFERENCES Customer(customerId)
);


CREATE TABLE Orders(
   ordersId SERIAL PRIMARY KEY NOT NULL,
   ordersTime TIMESTAMP DEFAULT current_timestamp,
   ready BOOLEAN NOT NULL,
   cartId INT NOT NULL,
   FOREIGN KEY (cartId) REFERENCES Cart(cartId)
);


CREATE TABLE Product(
   productId SERIAL PRIMARY KEY NOT NULL,
   description TEXT,
   image TEXT,
   name TEXT NOT NULL,
   price DOUBLE PRECISION CHECK (price >= 0),
	establishmentId INT NOT NULL,
    FOREIGN KEY (establishmentId) REFERENCES Establishment(establishmentId)
);

CREATE TABLE OrdersProduct(
quantity INT CHECK(quantity>0),
ordersId INT NOT NULL,
FOREIGN KEY (ordersId) REFERENCES Orders(ordersId),
productId INT NOT NULL,
FOREIGN KEY (productId) REFERENCES Product(productId),
PRIMARY KEY (ordersId, productId)
);