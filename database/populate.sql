INSERT INTO customers (full_name, email, phone, is_user, password) VALUES
                                                                       ('Admin User', 'admin@example.com', '111-222-3333', TRUE, 'admin_password_hash'),
                                                                       ('Regular User', 'user@example.com', '444-555-6666', FALSE, 'user_password_hash');

INSERT INTO address (customer_id, address, city, zip_code, country, box_now)
VALUES (1, '123 Main St', 'New York', '10001', 'USA', NULL);

INSERT INTO products (name, offer, description, price, quantity, main_image) VALUES
                                                                     ('Organic Tomatoes', 0,'Fresh organic tomatoes grown locally.', 2.99, 150, 'assets/images/products/1/product1_a.png'),
                                                                     ('Raw Honey', 0, 'Unprocessed honey harvested from local bees.', 6.50, 80, 'assets/images/products/2/product2_a.png'),
                                                                     ('Free-Range Eggs', 0, 'Dozen eggs from free-range hens.', 3.75, 100, 'assets/images/products/3/product3_a.png'),
                                                                     ('Homemade Jam', 0, 'Strawberry jam made from fresh fruit.', 4.20, 60, 'assets/images/products/4/product4_a.png'),
                                                                     ('Extra Virgin Olive Oil',0, 'Cold-pressed olive oil, 500ml bottle.', 10.00, 40, 'assets/images/products/5/product5_a.png');

INSERT INTO product_images (product_id,image_path) VALUES
                                                       ('1','assets/images/products/1/product1_b.png'),
                                                       ('1','assets/images/products/1/product1_c.png')



INSERT INTO coupons (name,code,type,value) VALUES
                                               ('Coupon 1','cpn1','money','5'),
                                               ('Coupon 2','cpn2','percentage','50'),
                                               ('Coupon 3', 'cpn3','shipping', 0)
