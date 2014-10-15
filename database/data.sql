--data


--establishment
insert into establishment (name) values ('Dynabox');
insert into establishment (name) values ('Meembee');
insert into establishment (name) values ('Centidel bar');
insert into establishment (name) values ('Oyonder');
insert into establishment (name) values ('Oyobar');


--person id 

insert into person (username, password) values ('aaa', 'aaa');
insert into person (username, password) values ('bburke1', 'PLBlp31Qd');
insert into person (username, password) values ('dfoster2', 'YyR8bX');
insert into person (username, password) values ('cbradley3', 'DY1COCnEKS');
insert into person (username, password) values ('dpatterson4', 'Bj9TAhd');
insert into person (username, password) values ('agreen5', '1KOMo1');
insert into person (username, password) values ('drichardson6', 'CTxL8G');
insert into person (username, password) values ('vbarnes7', 'YGgl0JAKRt');
insert into person (username, password) values ('greid8', 'IeL3OibM');
insert into person (username, password) values ('rmeyer9', 'NwaXgquyT');
insert into person (username, password) values ('bberrya', 'vAsXCepe');
insert into person (username, password) values ('nwallaceb', 'AHmYCEfJY9xR');
insert into person (username, password) values ('rhamiltonc', '7yOEbufwiR');
insert into person (username, password) values ('staylord', 'djtHnp52mDK');
insert into person (username, password) values ('gharrisone', '7DADz9qZvg');

insert into person (username, password) values ('man', 'man');
insert into person (username, password) values ('kfisher1', 'CtqxRK8y');
insert into person (username, password) values ('thunt2', 'JynjtZ');
insert into person (username, password) values ('plewis3', 'qy78RIObRE');
insert into person (username, password) values ('janderson4', 'D0BOAAGMNj1Y');

insert into person (username,password) values ('emp', 'emp');
insert into person (username,password) values ('chughes1', 'E7V6G3ftzI');
insert into person (username,password) values ('abarnes2', 'i2y3ZF');
insert into person (username,password) values ('nnguyen3', '2X7bIXQT215');
insert into person (username,password) values ('jnelson4', 'KkTrMOpzn');

insert into person (username,password) values ('lharper0', 'ov53bRQHeyGF');
insert into person (username,password) values ('jsanders1', '1VdxZNTqx7');
insert into person (username,password) values ('msims2', 'wvL2zyQyTf');
insert into person (username,password) values ('eray3', 'Bi4QplwWs1z');
insert into person (username,password) values ('cwagner4', 'e9FRqCWt');


--customer
insert into customer (customerid,name,email) values (1,'Janet Rodriguez', 'jrodriguez0@livejournal.com');
insert into customer (customerid,name,email) values (2,'Bonnie Burke', 'bburke1@vk.com');
insert into customer (customerid,name,email) values (3,'David Foster', 'dfoster2@wordpress.org');
insert into customer (customerid,name,email) values (4,'Carlos Bradley', 'cbradley3@theatlantic.com');
insert into customer (customerid,name,email) values (5,'Denise Patterson', 'dpatterson4@icq.com');
insert into customer (customerid,name,email) values (6,'Andrew Green', 'agreen5@wsj.com');
insert into customer (customerid,name,email) values (7,'Diane Richardson', 'drichardson6@technorati.com');
insert into customer (customerid,name,email) values (8,'Virginia Barnes', 'vbarnes7@cbsnews.com');
insert into customer (customerid,name,email) values (9,'Gerald Reid', 'greid8@addthis.com');
insert into customer (customerid,name,email) values (10,'Roy Meyer', 'rmeyer9@last.fm');
insert into customer (customerid,name,email) values (11,'Benjamin Berry', 'bberrya@google.co.jp');
insert into customer (customerid,name,email) values (12,'Norma Wallace', 'nwallaceb@behance.net');
insert into customer (customerid,name,email) values (13,'Rachel Hamilton', 'rhamiltonc@amazon.de');
insert into customer (customerid,name,email) values (14,'Shawn Taylor', 'staylord@1und1.de');
insert into customer (customerid,name,email) values (15,'George Harrison', 'gharrisone@wired.com');


--manager

insert into worker (workerid,establishmentid,permission) values (16,1,'manager');
insert into worker (workerid,establishmentid,permission) values (17,2,'manager');
insert into worker (workerid,establishmentid,permission) values (18,3,'manager');
insert into worker (workerid,establishmentid,permission) values (19,4,'manager');
insert into worker (workerid,establishmentid,permission) values (20,5,'manager');


--employee 

insert into worker (workerid,establishmentid,permission) values (21, 1,'employee');
insert into worker (workerid,establishmentid,permission) values (22, 2,'employee');
insert into worker (workerid,establishmentid,permission) values (23, 3,'employee');
insert into worker (workerid,establishmentid,permission) values (24, 4,'employee');
insert into worker (workerid,establishmentid,permission) values (25, 5,'employee');

--doorman
insert into worker (workerid,establishmentid,permission) values (26,1,'doorman');
insert into worker (workerid,establishmentid,permission) values (27,2,'doorman');
insert into worker (workerid,establishmentid,permission) values (28,3,'doorman');
insert into worker (workerid,establishmentid,permission) values (29,4,'doorman');
insert into worker (workerid,establishmentid,permission) values (30,5,'doorman');

--products
insert into product(description,image,name,price,establishmentId) values('', '', 'Bacardi', 7.5, 1);
insert into product(description,image,name,price,establishmentId) values('', '', 'Cabana Cachaça', 8.0, 1);
insert into product(description,image,name,price,establishmentId) values('Scotch single malt and amaretto', '', 'GodFather', 9.0, 2);
insert into product(description,image,name,price,establishmentId) values('', '', 'Vodka Absolut', 7.5, 2);
insert into product(description,image,name,price,establishmentId) values('', '', 'Gin Voyager', 10.0, 3);
insert into product(description,image,name,price,establishmentId) values('', '', 'Tequila Patron Platinum', 15.0, 3);
insert into product(description,image,name,price,establishmentId) values('', '', 'Absinthe Drip', 13.0, 4);
insert into product(description,image,name,price,establishmentId) values('', '', 'Vodka Absolut Citron', 8.0, 4);
insert into product(description,image,name,price,establishmentId) values('vodka, rum, lime and pineaple juice', '', 'Key Lime Twist', 12.0, 4);
insert into product(description,image,name,price,establishmentId) values('Tequila, creme de banana, white creme de cacao, and fresh lime juice', '', 'Mad Dog', 11.0, 4);

--cart
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (23.50,5.00,'2014-09-01 20:00:00','2014-09-01 23:00:00',true,1,1,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (18.00,0,'2014-10-02 21:00:00','2014-10-03 02:00:00',true,2,2,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (7.50,0,'2014-10-01 00:00:00','2014-10-01 05:00:00',true,3,3,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (22.50,0,'2014-09-26 19:00:00','2014-09-27 03:00:00',true,4,4,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (11.0,0,'2014-09-10 23:00:00','2014-09-10 23:30:00',true,5,5,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (12.00,0,'2014-10-03 20:00:00',NULL,false,1,1,'');
insert into cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId,qrcode) values (8.0,0,'2014-10-03 20:00:00',NULL,false,4,6,'');

--orders 
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-09-01 21:00:00','delivered',1,1,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-09-01 21:00:00','delivered',1,2,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-09-01 21:30:00','delivered',1,3,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-10-03 01:00:00','delivered',2,3,2);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-10-01 04:00:00','delivered',3,4,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-09-27 02:00:00','delivered',4,4,3);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-09-10 23:10:00','delivered',5,10,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-10-03 21:00:00','delivered',6,9,1);
insert into orders(ordersTime,orderState,cartId,productid,quantity) values ('2014-10-03 21:00:00','notified',7,8,1);
