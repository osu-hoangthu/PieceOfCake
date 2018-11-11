DROP TABLE IF EXISTS `orders_menuitems`;
DROP TABLE IF EXISTS `menuitem_ingredients`;
DROP TABLE IF EXISTS `employees_customers`;
DROP TABLE IF EXISTS menu_items;

-- ----------------------------------------MENU ITEMS --------------------------------------
/*Creating table for Menu Items entity*/
CREATE TABLE `menu_items`(
	`item_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `cost`float(5) NOT NULL,
    `food_type` varchar(255) NOT NULL,
    PRIMARY KEY(`item_id`),
    UNIQUE KEY(`name`)
) ENGINE = INNODB;

INSERT INTO `menu_items` (name, cost, food_type) VALUES
('Strawberry Pie', 4.5, 'Slice'),
('Chocolate Cream Pie Shake', 6, 'Milkshake'),
('Key Lime Pie', 13, 'Whole'),
('Lemon Meringue', 5, 'Slice'),
('Pecan Pie Shake', 5.5, 'Milkshake');

-- ----------------------------------------INGREDIENTS --------------------------------------

DROP TABLE IF EXISTS ingredients;
/*Creating table for Ingredients entity*/
CREATE TABLE `ingredients`(
	`sku` varchar(6) NOT NULL,
    `name` varchar(255) NOT NULL,
    `cost` float NOT NULL,
    `inventory` int(11) NOT NULL DEFAULT 0,
    PRIMARY KEY(`sku`)
) ENGINE = INNODB;

/*Inserting five rows of sample data into Ingredients table*/
INSERT INTO `ingredients` (sku, name, cost, inventory) VALUES
('HFG765', 'Apples', 15, 14),
('LIU987', 'Butter', 10, 29),
('SVF521', 'Chocolate', 25, 4),
('NIR438', 'Rhubarb', 9, 2),
('MFD630', 'Milk', 2, 10);

-- ----------------------------------------EMPLOYEES --------------------------------------

DROP TABLE IF EXISTS orders; /*delete orders first for foreign key constraint*/
DROP TABLE IF EXISTS employees;
/*Creating table for Employees entity*/
CREATE TABLE `employees`(
    `emp_id` int(11) NOT NULL AUTO_INCREMENT,
    `fname` varchar(255) NOT NULL,
    `lname` varchar(255) NOT NULL,
    `pay` float NOT NULL,
    `hours` float NOT NULL,
    PRIMARY KEY(`emp_id`)
) ENGINE = INNODB;

/*Inserting five rows of sample data into Employees table*/
INSERT INTO `employees` (fname, lname, pay, hours) VALUES
('Lebron', 'James', 12.5, 40), 
('Stephen', 'Curry', 10, 20),
('Michael', 'Jordan', 21.5, 40),
('Carmelo', 'Anthony', 15, 20),
('Damian', 'Lillard', 15, 40);

-- ----------------------------------------CUSTOMERS --------------------------------------

DROP TABLE IF EXISTS customers; 
/*Creating table for Customers entity*/
CREATE TABLE `customers`(
	`cust_id` int(11) NOT NULL AUTO_INCREMENT,
	`phone_num` varchar(255) NOT NULL,
    `fname` varchar(255) NOT NULL,
    `lname` varchar(255) NOT NULL,
    PRIMARY KEY(`cust_id`)
) ENGINE = INNODB;

/*Inserting five rows of sample data into Customers table*/
INSERT INTO `customers` (phone_num, fname, lname) VALUES 
('971-475-8633', 'Ariana', 'Grande'),
('503-630-0934', 'Chris', 'Pratt'),
('287-983-1156', 'Meryl', 'Streep'),
('765-364-7643', 'Ed', 'Sheeran'),
('285-054-2348', 'Justin', 'Bieber');

-- ----------------------------------------ORDERS--------------------------------------

/*Creating table for Orders entity*/
CREATE TABLE `orders`(
	`order_id` int(11) NOT NULL AUTO_INCREMENT,
	`cust_id` int(11) NOT NULL,
	`emp_id` int(11) NOT NULL,
    `num_items` int(11) NOT NULL,
    `cost` float NOT NULL,
	FOREIGN KEY(`cust_id`) REFERENCES `customers`(`cust_id`),
	FOREIGN KEY(`emp_id`) REFERENCES `employees`(`emp_id`),
	PRIMARY KEY(`order_id`)
) ENGINE = INNODB;

/*Inserting five rows of sample data into Orders table*/
INSERT INTO `orders` (order_id, cust_id, emp_id, num_items, cost) VALUES 
(1, 1, 2, 1, 5.5),
(2, 2, 1, 2, 10),
(3, 3, 4, 1, 13),
(4, 4, 3, 4, 46.2),
(5, 5, 5, 2, 25);

/*--------------------------------------Relationship Tables------------------------------------------*/

/*Creating table for the 'are made from' many to many relationship between ingredients and menu items*/
CREATE TABLE `menuitem_ingredients`(
    `item_id` int(11) NOT NULL,
    `sku` varchar(6) NOT NULL,
    primary key(item_id, sku),
    foreign key(item_id) references menu_items(item_id),
    foreign key(sku) references ingredients(sku)
);
/*Inserting five rows of sample data into MenuItems_Ingredients table*/
INSERT INTO `menuitem_ingredients` (item_id, sku) VALUES 
(3, 'HFG765'),
(1, 'LIU987'),
(4, 'SVF521'),
(2, 'NIR438'),
(5, 'MFD630');

/*Creating table for the 'serve' many to many relationship between employees and customers*/
CREATE TABLE `employees_customers`(
    `emp_id` int(11) NOT NULL,
    `cust_id` int(11) NOT NULL,
    primary key(emp_id, cust_id),
    foreign key(emp_id) references employees(emp_id),
    foreign key(cust_id) references customers(cust_id)
);
/*Inserting five rows of sample data into Employees_Customers table*/
INSERT INTO `employees_customers` (emp_id, cust_id) VALUES 
(2, 1),
(3, 2),
(5, 5),
(1, 3),
(4, 4);

/*Creating table for the 'consist of' many to many relationship between orders and menu items*/
CREATE TABLE `orders_menuitems`(
    `item_id` int(11) NOT NULL,
    `order_id` int(11) NOT NULL,
    primary key(item_id, order_id),
    foreign key(item_id) references menu_items(item_id),
    foreign key(order_id) references orders(order_id)
);

/*Inserting five rows of sample data into Orders_Menuitems table*/
INSERT INTO `orders_menuitems` (item_id, order_id) VALUES 
(2, 1),
(3, 2),
(1, 3),
(4, 4),
(5, 5);