-- This is the data manipulation queries to work on the website for the restaurant Piece of Cake

--Add new Employee to DB
INSERT INTO employees (fname, lname, pay, hours) VALUES (:fname, :lname, :pay, :hours);

--Display all Employees on "employee.html" page
SELECT emp_id, fname, lname, pay, hours FROM employees;

--Add Orders to DB
INSERT INTO orders (num_items, cost) VALUES (:num_items, :cost);

--Display all Orders on "orders.html" page
SELECT order_id, num_items, cost FROM orders;

--Add Customers to DB
INSERT INTO customers (phone_num, fname, lname, order_id) VALUES (:phone_num, :fname, :lname, :order_id);

--Display all Customers on customers page
SELECT phone_num, fname, lname, order_id FROM customers;