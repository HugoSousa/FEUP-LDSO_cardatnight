drop table if exists orders;
drop table if exists product;
drop table if exists cart;
drop table if exists worker;
drop table if exists customer;
drop table if exists person;
drop table if exists establishment;
drop type if exists worker_permission;

create table establishment(
   establishmentid serial primary key not null,
   name text not null
);

create table person(
   personid serial primary key not null,
   username text unique not null,
   password text not null
);

create table customer(
   customerid int primary key not null,
   name text not null,
   email text not null,
   foreign key (customerid) references person(personid)
);

create type worker_permission as enum ('employee', 'manager', 'doorman');

create table worker(
   workerid int primary key not null,
   establishmentid int not null,
   permission worker_permission,
   foreign key (workerid) references person(personid),
   foreign key (establishmentid) references establishment(establishmentid)
);

create table cart(
   cartid serial primary key not null,
   balance double precision check (balance >= 0),
   credit double precision check (credit >= 0),
   entrancetime timestamp default current_timestamp,
   exittime timestamp,
   paid boolean not null,
   establishmentid int not null,
   customerid int not null,
   qrcode text not null,
   foreign key (establishmentid) references establishment(establishmentid),
   foreign key (customerid) references customer(customerid)
);

create table product(
   productid serial primary key not null,
   description text,
   image text,
   name text not null,
   price double precision check (price >= 0),
   establishmentid int not null,
   foreign key (establishmentid) references establishment(establishmentid)
);

create table orders(
   ordersid serial primary key not null,
   orderstime timestamp default current_timestamp,
   ready boolean not null,
   cartid int not null,
   productid int not null,
   quantity int check(quantity>0),
   foreign key (cartid) references cart(cartid),
   foreign key (productid) references product(productid)
);


