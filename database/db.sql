drop table if exists orders;
drop table if exists product;
drop table if exists cart;
drop table if exists worker;
drop table if exists customer;
drop table if exists person;
drop table if exists establishment;
drop table if exists category;
drop table if exists ordercode;
drop type if exists worker_permission;
drop type if exists product_state;

create table establishment(
   establishmentid serial primary key not null,
   name text not null,
   address text,
   entrancecost double precision check (entrancecost >= 0)
);

create table person(
   personid serial primary key not null,
   username text unique not null,
   password text not null
);

create table customer(
   customerid int primary key not null,
   name text not null,
   email text unique not null,
   deleted boolean not null default false,
   foreign key (customerid) references person(personid)
);

create type worker_permission as enum ('employee', 'manager', 'doorman');

create table worker(
   workerid int primary key not null,
   establishmentid int not null,
   permission worker_permission,
   foreign key (workerid) references person(personid) on delete cascade,
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
   foreign key (customerid) references customer(customerid) on delete cascade
);

create table category(
   categoryid serial primary key not null,
   name text not null
);

create table product(
   productid serial primary key not null,
   description text,
   image text,
   name text not null,
   price double precision check (price >= 0),
   establishmentid int not null,
   categoryid int not null,
   deleted boolean not null default false,
   foreign key (establishmentid) references establishment(establishmentid),
   foreign key (categoryid) references category(categoryid)
);

create type product_state as enum ('ordered','notified', 'delivered');

create table ordercode(
   ordercodeid serial primary key not null,
   code text not null
);

create table orders(
   ordersid serial primary key not null,
   orderstime timestamp default current_timestamp,
   orderstate product_state not null,
   cartid int not null,
   productid int not null,
   quantity int check(quantity>0),
   ordercodeid int not null,
   foreign key (cartid) references cart(cartid) on delete cascade,
   foreign key (productid) references product(productid),
   foreign key (ordercodeid) references ordercode(ordercodeid)
);