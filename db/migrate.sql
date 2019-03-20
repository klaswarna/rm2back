DROP TABLE IF EXISTS bolag;

CREATE TABLE IF NOT EXISTS bolag (
    name VARCHAR(60) NOT NULL,
    amount1 FLOAT,
    amount2 FLOAT,
    amount3 FLOAT,
    amount4 FLOAT,
    amount5 FLOAT
);

INSERT INTO bolag (name, amount1, amount2, amount3, amount4, amount5)
VALUES ("portfolj", 100, 100, 100, 100, 100);


DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);


DROP TABLE IF EXISTS innehav;

CREATE TABLE IF NOT EXISTS innehav (
    email VARCHAR(60) NOT NULL,
    kapital FLOAT,
    stock1 INT,
    stock2 INT,
    stock3 INT,
    stock4 INT,
    stock5 INT,
    UNIQUE(email)
);
