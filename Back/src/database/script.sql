create database if not EXISTS logindb;

use logindb;

create table if not EXISTS user(
    id int not null AUTO_INCREMENT,
    name varchar(100) not null,
    mail varchar(100) not null,
    user varchar(100) not null,
    password varchar(100) not null,
    PRIMARY KEY (id)
);