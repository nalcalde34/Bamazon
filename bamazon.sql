DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INT NOT NULL auto_increment,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INTEGER(10),

PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PS4", "Electronics", 300, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One", "Electronics", 250, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Electronics", 300, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Friday Night Lights", "Books", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Avengers: Endgame", "Movies", 18, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Super Smash Bros Ultimate", "Games", 60, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Macbook Pro", "Electronics", 300, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apple Watch", "Electronics", 500, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Earpods", "Electronics", 120, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nike Free Runners ", "Shoes", 100, 20);






