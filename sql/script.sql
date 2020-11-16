CREATE SCHEMA sitesegunda;

USE sitesegunda;

CREATE TABLE arte (
    idArte INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    titleArte VARCHAR(100) NOT NULL,
    descArte VARCHAR(200) NOT NULL,
    dateArte DATE NOT NULL
);
