CREATE SCHEMA sitesegunda;

USE sitesegunda;

CREATE TABLE arte (
    idarte INT NOT NULL,
    titlearte VARCHAR(100) NOT NULL,
    descarte VARCHAR(200) NOT NULL,
    datearte DATE NOT NULL,
    PRIMARY KEY (idarte)
);
