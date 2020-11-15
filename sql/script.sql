CREATE SCHEMA siteSegunda;

USE siteSegunda;

CREATE TABLE Arte (
    idArte INT NOT NULL,
    titleArte VARCHAR(100) NOT NULL,
    descArte VARCHAR(200) NOT NULL,
    dateArte DATE NOT NULL,
    PRIMARY KEY (idArte)
);