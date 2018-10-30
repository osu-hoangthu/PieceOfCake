-- This is the data manipulation queries to work on the website for the restaurant Piece of Cake

--Add new Employee to DB
INSERT INTO employees (fname, lname, pay, hours) VALUES (:fname, :lname, :pay, :hours);

--Display all Employees on "employee.html" page
SELECT emp_id, fname, lname, pay, hours FROM employees;

--Remove an Employee from the DB
DELETE FROM employees WHERE emp_id = :employee_id_selected_from_employees_page;

--Add Orders to DB
INSERT INTO orders (num_items, cost) VALUES (:num_items, :cost);

--Display all Orders on "orders.html" page
SELECT order_id, num_items, cost FROM orders;

--Add Customers to DB
INSERT INTO customers (phone_num, fname, lname, order_id) VALUES (:phone_num, :fname, :lname, :order_id);

--Display all Customers on customers page
SELECT phone_num, fname, lname, order_id FROM `customers`;

-- update a customer's data when they put in a new order
UPDATE customers SET order_id = :order_id_input WHERE phone_num= :phone_num_input_in_field;

--Select all ingredients that are out of stock at the restaurant so they can be reordered
SELECT name, cost FROM `ingredients` WHERE inventory= 0;

--Look up an ingredient's name and cost based on its SKU
SELECT name, cost FROM `ingredients` WHERE sku= :input_sku;

-- Determining a customer's total order cost for billing purposes
SELECT orders.order_id, customers.fname, customers.lname, orders.cost
FROM orders
INNER JOIN customers ON orders.order_id = customers.order_id;

-- Obtain a list of all milkshake flavors and their costs 
SELECT name, cost FROM `menu_items` WHERE food_type = Milkshake;

--Remove item from menu (ex: seasonal items)
DELETE FROM menu_items WHERE item_id = :input_item_id;

SELECT phone_num, fname, lname, order_id FROM customers;
