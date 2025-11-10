-- Sample data for testing the inventory system

-- Insert Categories
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Vegetables', 'Fresh vegetables and produce', NOW(), NOW()),
('Dairy', 'Milk, cheese, and dairy products', NOW(), NOW()),
('Meat', 'Fresh meat and poultry', NOW(), NOW()),
('Beverages', 'Drinks and beverages', NOW(), NOW()),
('Pantry', 'Dry goods and pantry items', NOW(), NOW());

-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, created_at, updated_at) VALUES
('Fresh Farm Co.', 'John Farmer', 'john@freshfarm.com', '555-0001', '123 Farm Road', NOW(), NOW()),
('Dairy Delight', 'Mary Milk', 'mary@dairydelight.com', '555-0002', '456 Dairy Lane', NOW(), NOW()),
('Meat Masters', 'Bob Butcher', 'bob@meatmasters.com', '555-0003', '789 Meat Street', NOW(), NOW()),
('Beverage Bros', 'Tom Drink', 'tom@beveragebros.com', '555-0004', '321 Drink Ave', NOW(), NOW());

-- Insert Products
INSERT INTO products (name, description, sku, price, quantity, reorder_level, category_id, supplier_id, active, created_at, updated_at) VALUES
('Tomatoes', 'Fresh red tomatoes', 'VEG-001', 2.99, 50, 20, 1, 1, true, NOW(), NOW()),
('Lettuce', 'Crisp green lettuce', 'VEG-002', 1.99, 30, 15, 1, 1, true, NOW(), NOW()),
('Carrots', 'Organic carrots', 'VEG-003', 1.49, 40, 20, 1, 1, true, NOW(), NOW()),
('Milk', 'Fresh whole milk 1L', 'DAI-001', 3.99, 25, 10, 2, 2, true, NOW(), NOW()),
('Cheese', 'Cheddar cheese block', 'DAI-002', 6.99, 15, 8, 2, 2, true, NOW(), NOW()),
('Chicken Breast', 'Boneless chicken breast', 'MEA-001', 8.99, 12, 20, 3, 3, true, NOW(), NOW()),
('Ground Beef', 'Lean ground beef', 'MEA-002', 7.99, 18, 15, 3, 3, true, NOW(), NOW()),
('Orange Juice', 'Fresh squeezed OJ', 'BEV-001', 4.99, 20, 10, 4, 4, true, NOW(), NOW()),
('Coffee', 'Premium coffee beans', 'BEV-002', 12.99, 35, 15, 4, 4, true, NOW(), NOW()),
('Rice', 'Basmati rice 5kg', 'PAN-001', 15.99, 28, 10, 5, 1, true, NOW(), NOW()),
('Pasta', 'Italian pasta', 'PAN-002', 3.49, 45, 20, 5, 1, true, NOW(), NOW()),
('Olive Oil', 'Extra virgin olive oil 1L', 'PAN-003', 9.99, 8, 15, 5, 1, true, NOW(), NOW());

SELECT 'Sample data inserted successfully!' AS message;

-- Check the data
SELECT COUNT(*) AS 'Total Categories' FROM categories;
SELECT COUNT(*) AS 'Total Suppliers' FROM suppliers;
SELECT COUNT(*) AS 'Total Products' FROM products;

-- Insert initial admin user (email: admin@gmail.com, password: admin123)
-- Password is Base64-encoded to match the demo AuthService encoding (YWRtaW4xMjM=)
INSERT INTO users (first_name, last_name, email, password, active, role, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@gmail.com', 'YWRtaW4xMjM=', true, 'ADMIN', NOW(), NOW());

SELECT 'Admin user inserted (admin@gmail.com) — password: admin123 (Base64 encoded in DB)' AS message;
