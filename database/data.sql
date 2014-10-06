--data

--customer
insert into Customer (name, email, username, password) values ('Janet Rodriguez', 'jrodriguez0@livejournal.com', 'jrodriguez0', 'dRWEQ6M9H');
insert into Customer (name, email, username, password) values ('Bonnie Burke', 'bburke1@vk.com', 'bburke1', 'PLBlp31Qd');
insert into Customer (name, email, username, password) values ('David Foster', 'dfoster2@wordpress.org', 'dfoster2', 'YyR8bX');
insert into Customer (name, email, username, password) values ('Carlos Bradley', 'cbradley3@theatlantic.com', 'cbradley3', 'DY1COCnEKS');
insert into Customer (name, email, username, password) values ('Denise Patterson', 'dpatterson4@icq.com', 'dpatterson4', 'Bj9TAhd');
insert into Customer (name, email, username, password) values ('Andrew Green', 'agreen5@wsj.com', 'agreen5', '1KOMo1');
insert into Customer (name, email, username, password) values ('Diane Richardson', 'drichardson6@technorati.com', 'drichardson6', 'CTxL8G');
insert into Customer (name, email, username, password) values ('Virginia Barnes', 'vbarnes7@cbsnews.com', 'vbarnes7', 'YGgl0JAKRt');
insert into Customer (name, email, username, password) values ('Gerald Reid', 'greid8@addthis.com', 'greid8', 'IeL3OibM');
insert into Customer (name, email, username, password) values ('Roy Meyer', 'rmeyer9@last.fm', 'rmeyer9', 'NwaXgquyT');
insert into Customer (name, email, username, password) values ('Benjamin Berry', 'bberrya@google.co.jp', 'bberrya', 'vAsXCepe');
insert into Customer (name, email, username, password) values ('Norma Wallace', 'nwallaceb@behance.net', 'nwallaceb', 'AHmYCEfJY9xR');
insert into Customer (name, email, username, password) values ('Rachel Hamilton', 'rhamiltonc@amazon.de', 'rhamiltonc', '7yOEbufwiR');
insert into Customer (name, email, username, password) values ('Shawn Taylor', 'staylord@1und1.de', 'staylord', 'djtHnp52mDK');
insert into Customer (name, email, username, password) values ('George Harrison', 'gharrisone@wired.com', 'gharrisone', '7DADz9qZvg');

--establishment
insert into Establishment (name) values ('Dynabox');
insert into Establishment (name) values ('Meembee');
insert into Establishment (name) values ('Centidel bar');
insert into Establishment (name) values ('Oyonder');
insert into Establishment (name) values ('Oyobar');

--manager
insert into Manager (username, password, establishmentId) values ('dhughes0', 'hs30t5Ost', 1);
insert into Manager (username, password, establishmentId) values ('kfisher1', 'CtqxRK8y', 2);
insert into Manager (username, password, establishmentId) values ('thunt2', 'JynjtZ', 3);
insert into Manager (username, password, establishmentId) values ('plewis3', 'qy78RIObRE', 4);
insert into Manager (username, password, establishmentId) values ('janderson4', 'D0BOAAGMNj1Y', 5);

--employee 

insert into Employee (username, password, establishmentId) values ('jcrawford0', 'XoFK5jTM', 1);
insert into Employee (username, password, establishmentId) values ('chughes1', 'E7V6G3ftzI', 2);
insert into Employee (username, password, establishmentId) values ('abarnes2', 'i2y3ZF', 3);
insert into Employee (username, password, establishmentId) values ('nnguyen3', '2X7bIXQT215', 4);
insert into Employee (username, password, establishmentId) values ('jnelson4', 'KkTrMOpzn', 5);

--products
insert into Product(description,image,name,price,establishmentId) values('', '', 'Bacardi', 7.5, 1);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Cabana Cachaça', 8.0, 1);
insert into Product(description,image,name,price,establishmentId) values('Scotch single malt and amaretto', '', 'GodFather', 9.0, 2);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Vodka Absolut', 7.5, 2);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Gin Voyager', 10.0, 3);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Tequila Patron Platinum', 15.0, 3);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Absinthe Drip', 13.0, 4);
insert into Product(description,image,name,price,establishmentId) values('', '', 'Vodka Absolut Citron', 8.0, 4);
insert into Product(description,image,name,price,establishmentId) values('vodka, rum, lime and pineaple juice', '', 'Key Lime Twist', 12.0, 4);
insert into Product(description,image,name,price,establishmentId) values('Tequila, creme de banana, white creme de cacao, and fresh lime juice', '', 'Mad Dog', 11.0, 4);

--orders 
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (23.50,5.00,'2014-09-01 20:00:00','2014-09-01 23:00:00',true,1,1);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (18.00,0,'2014-10-02 21:00:00','2014-10-03 02:00:00',true,2,2);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (7.50,0,'2014-10-01 00:00:00','2014-10-01 05:00:00',true,3,3);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (22.50,0,'2014-09-26 19:00:00','2014-09-27 03:00:00',true,4,4);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (11.0,0,'2014-09-10 23:00:00','2014-09-10 23:30:00',true,5,5);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (12.00,0,'2014-10-03 20:00:00',NULL,false,1,1);
insert into Cart(balance,credit,entranceTime,exitTime,paid,establishmentId,customerId) values (8.0,0,'2014-10-03 20:00:00',NULL,false,4,6);


insert into Orders(ordersTime,ready,cartId) values ('2014-09-01 21:00:00',true,1);
insert into Orders(ordersTime,ready,cartId) values ('2014-09-01 21:30:00',true,1);
insert into Orders(ordersTime,ready,cartId) values ('2014-10-03 01:00:00',true,2);
insert into Orders(ordersTime,ready,cartId) values ('2014-10-01 04:00:00',true,3);
insert into Orders(ordersTime,ready,cartId) values ('2014-09-27 02:00:00',true,4);
insert into Orders(ordersTime,ready,cartId) values ('2014-09-10 23:10:00',true,5);
insert into Orders(ordersTime,ready,cartId) values ('2014-10-03 21:00:00',true,6);
insert into Orders(ordersTime,ready,cartId) values ('2014-10-03 21:00:00',false,7);

insert into OrdersProduct(quantity,ordersId,productId) values (1,1,1);
insert into OrdersProduct(quantity,ordersId,productId) values (1,1,2);
insert into OrdersProduct(quantity,ordersId,productId) values (1,2,3);
insert into OrdersProduct(quantity,ordersId,productId) values (2,3,3);
insert into OrdersProduct(quantity,ordersId,productId) values (1,4,4);
insert into OrdersProduct(quantity,ordersId,productId) values (3,5,4);
insert into OrdersProduct(quantity,ordersId,productId) values (1,6,10);
insert into OrdersProduct(quantity,ordersId,productId) values (1,7,9);
insert into OrdersProduct(quantity,ordersId,productId) values (1,8,8);