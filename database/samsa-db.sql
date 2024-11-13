CREATE DATABASE samsa;
USE samsa;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    date_of_birth DATE,
    contact_number INT,
    address VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES **users**(user_id)  -- Changed from `customers` to `users`
);

CREATE TABLE menu_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50),
    description TEXT
);

CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES menu_categories(category_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE daily_menu (
    daily_menu_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    menu_date DATE NOT NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    adults INT,
    children INT,
    reservation_date DATE,
    reservation_time TIME,
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE password_reset_requests (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reset_token VARCHAR(255),
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_time TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE login_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    successful BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Sample Data Insertion
INSERT INTO users (full_name, date_of_birth, contact_number, address, email, password) 
VALUES ('Husu', '1990-01-01', '045841222', 'Espoo', 'husu@gmaik.com', 'nopass');

INSERT INTO menu_categories (category_name, description) 
VALUES ('Afghan Cuisine', 'Traditional Afghan dishes');

INSERT INTO menu_items (category_id, name, description, price, is_available) 
VALUES (1, 'Chalaw', 'A delicious traditional food', 19.99, TRUE);

INSERT INTO orders (user_id, status, total_amount) 
VALUES (1, 'Completed', 19.99);

INSERT INTO menu_items (category_id, name, description, price, is_available) 
VALUES (3, 'samsa', 'A delicious traditional food', 19.99, TRUE);

INSERT INTO daily_menu (item_id, menu_date) 
VALUES (2, '2024-11-08');

INSERT INTO menu_categories (category_name, description) 
VALUES ('Traditional Dishes', 'A category for traditional foods');

INSERT INTO menu_items (category_id, name, description, price, is_available) 
VALUES (2, 'samsa', 'A delicious traditional food', 19.99, TRUE);

-- Querying Orders for a Specific User
SELECT Orders.order_id, Orders.order_date, Orders.status, Orders.total_amount,
       Menu_Items.name AS item_name, Order_Items.quantity, Order_Items.price
FROM orders
JOIN order_items ON orders.order_id = order_items.order_id
JOIN menu_items ON order_items.item_id = menu_items.item_id
WHERE orders.user_id = 1;

-- Querying Daily Menu for a Specific Date
SELECT menu_items.name, menu_items.description, menu_items.price
FROM daily_menu
JOIN menu_items ON daily_menu.item_id = menu_items.item_id
WHERE daily_menu.menu_date = '2024-11-05';
