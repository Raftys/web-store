-- auto-generated definition
CREATE TABLE customers
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email     VARCHAR(100) NOT NULL,
    phone     VARCHAR(15)  NOT NULL,
    address   VARCHAR(255) NOT NULL,
    city      VARCHAR(100) NOT NULL,  -- Fixed typo here
    zip_code  VARCHAR(10)  NOT NULL,
    country   VARCHAR(100) NOT NULL,
    box_now   VARCHAR(255) NULL
);

-- auto-generated definition
CREATE TABLE users
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100)         NOT NULL,
    email     VARCHAR(100)         NOT NULL,
    phone     VARCHAR(15)          NOT NULL,
    address   VARCHAR(255)         NOT NULL,
    city      VARCHAR(100)         NOT NULL,
    zip_code  VARCHAR(10)          NOT NULL,
    country   VARCHAR(100)         NOT NULL,
    password  VARCHAR(255)         NULL,
    root      TINYINT(1) DEFAULT 0 NOT NULL,
    box_now   VARCHAR(255)         NULL,
    CONSTRAINT unique_email UNIQUE (email)
);

-- auto-generated definition
CREATE TABLE products
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT NULL,
    price       FLOAT NOT NULL,
    quantity    INT NOT NULL,
    image       TEXT NULL
);

-- auto-generated definition
CREATE TABLE orders
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NULL,
    order_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    total_amount   DECIMAL(10, 2) NULL,
    status         ENUM ('pending', 'processed', 'shipped', 'delivered', 'canceled') DEFAULT 'pending' NULL,
    customer_id    INT NULL,
    payment_method VARCHAR(255) NULL,
    receipt        VARCHAR(255) NULL,
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_user_id ON orders (user_id);

-- auto-generated definition
CREATE TABLE order_items
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NULL,
    product_id INT NULL,
    quantity   INT NULL,
    price      DECIMAL(10, 2) NULL,
    total      DECIMAL(10, 2) NULL,
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE INDEX idx_order_id ON order_items (order_id);
CREATE INDEX idx_product_id ON order_items (product_id);
