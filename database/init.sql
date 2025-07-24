-- init.sql

-- Ensure the tables are created only if they don't already exist
-- This prevents errors on subsequent container restarts if data persists
CREATE TABLE IF NOT EXISTS customers (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email     VARCHAR(100) NOT NULL,
    phone     VARCHAR(15)  NOT NULL,
    is_user   BOOLEAN DEFAULT FALSE,
    password  VARCHAR(100) NOT NULL
    );

CREATE TABLE IF NOT EXISTS address (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,  -- Foreign key to customers
    address     VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    zip_code    VARCHAR(10)  NOT NULL,
    country     VARCHAR(100) NOT NULL,
    box_now     VARCHAR(255) DEFAULT NULL,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        TEXT NOT NULL,
    offer       BOOLEAN NOT NULL DEFAULT 0,
    small_description TEXT NULL,
    description TEXT NULL,
    price       FLOAT NOT NULL,
    quantity    INT NOT NULL,
    main_image       TEXT NULL
);

CREATE TABLE IF NOT EXISTS product_images (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    product_id  INT NOT NULL,
    image_path  TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS coupons (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        TEXT NOT NULL,
    code        TEXT NOT NULL,
    type        TEXT NOT NULL,
    value       INT NOT NULL

    );

CREATE TABLE IF NOT EXISTS orders (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NULL,
    order_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    sub_total      DECIMAL(10, 2) NOT NULL,
    coupon         TEXT NULL,
    shipping       DECIMAL(10, 2) NOT NULL,
    total_price    DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    receipt        VARCHAR(255) NOT NULL,
    status         ENUM ('pending', 'processing', 'shipped', 'delivered', 'canceled') DEFAULT 'pending' NULL,
    full_name      VARCHAR(255) NULL,
    email          VARCHAR(255) NULL,
    phone          VARCHAR(50) NULL,
    address_id     INT NULL,
    address        TEXT NULL,
    zip_code       VARCHAR(20) NULL,
    city           VARCHAR(100) NULL,
    country        VARCHAR(100) NULL,
    box_now        VARCHAR(100) NULL,
    customer_id    INT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    );


-- Create indexes for performance on frequently queried columns
CREATE INDEX idx_user_id ON orders(user_id);


CREATE TABLE IF NOT EXISTS order_items (
                                           id         INT AUTO_INCREMENT PRIMARY KEY,
                                           order_id   INT NULL,
                                           product_id INT NULL,
                                           quantity   INT NULL,
                                           price      DECIMAL(10, 2) NULL,
    total      DECIMAL(10, 2) NULL,
    -- Define foreign key constraints
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    );

-- Create indexes for performance on frequently queried columns
CREATE INDEX idx_order_id ON order_items(order_id);
CREATE INDEX idx_product_id ON order_items(product_id);