create database if not EXISTS logindb;

use logindb;

create table if not EXISTS user(
    id int not null AUTO_INCREMENT,
    name varchar(100) not null,
    mail varchar(100) not null,
    username varchar(100) not null,
    password varchar(100) not null,
    failedSessions int not null,
    PRIMARY KEY (id)
);

create table if not EXISTS link(
    id int not null AUTO_INCREMENT,
    link varchar(200) not null,
    username varchar(100) not null,
    PRIMARY KEY (id)
);