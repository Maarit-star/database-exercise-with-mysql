DROP DATABASE IF EXISTS kissatietokanta;
CREATE DATABASE kissatietokanta;
USE kissatietokanta;
CREATE USER IF NOT EXISTS 'pentti'@'localhost' IDENTIFIED BY 'tpLyaaZd';
CREATE TABLE kissa(
    numero INTEGER NOT NULL PRIMARY KEY,
    nimi VARCHAR(17) NOT NULL,
    rotu VARCHAR(16) NOT NULL,
    painoKg INTEGER NOT NULL,
    pituus INTEGER NOT NULL
);
GRANT ALL PRIVILEGES ON henkilotietokanta.* TO 'pentti'@'localhost';