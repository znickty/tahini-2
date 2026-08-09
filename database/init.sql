CREATE DATABASE IF NOT EXISTS tahini_house;
USE tahini_house;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    preparation_time INT DEFAULT 15,
    calories INT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product options (like size, extras)
CREATE TABLE IF NOT EXISTS product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    delivery_address TEXT,
    delivery_area VARCHAR(100),
    order_type ENUM('delivery', 'pickup', 'dine_in') DEFAULT 'delivery',
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'online') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    special_instructions TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_date (order_date),
    INDEX idx_status (status)
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    product_name_en VARCHAR(255),
    product_name_ar VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    options TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Daily sales tracking
CREATE TABLE IF NOT EXISTS daily_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE NOT NULL,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    cash_payments DECIMAL(10, 2) DEFAULT 0,
    card_payments DECIMAL(10, 2) DEFAULT 0,
    online_payments DECIMAL(10, 2) DEFAULT 0,
    UNIQUE KEY unique_date (sale_date)
);

-- Custom sales (in-restaurant)
CREATE TABLE IF NOT EXISTS custom_sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_date DATE NOT NULL,
    description_en VARCHAR(255),
    description_ar VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card') DEFAULT 'cash',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name_en, name_ar, icon, sort_order) VALUES
('Appetizers', 'المقبلات', '🍢', 1),
('Main Dishes', 'الأطباق الرئيسية', '🍖', 2),
('Sandwiches', 'ساندويتشات', '🥪', 3),
('Beverages', 'المشروبات', '🥤', 4),
('Desserts', 'الحلويات', '🍰', 5);

-- Insert sample products
INSERT INTO products (category_id, name_en, name_ar, description_en, description_ar, price, image_url, is_available) VALUES
(1, 'Hummus', 'حمص', 'Classic creamy hummus with olive oil', 'حمص كريمي تقليدي مع زيت الزيتون', 25.00, '/images/hummus.jpg', 1),
(1, 'Baba Ghanoush', 'بابا غنوج', 'Smoked eggplant dip', 'متبل الباذنجان المدخن', 28.00, '/images/baba-ghanoush.jpg', 1),
(2, 'Mixed Grill', 'مشاوي مشكلة', 'Assorted grilled meats with rice', 'تشكيلة مشاوي مع الأرز', 65.00, '/images/mixed-grill.jpg', 1),
(2, 'Kabsa', 'كبسة', 'Traditional Saudi rice dish with chicken', 'طبق الأرز السعودي التقليدي مع الدجاج', 55.00, '/images/kabsa.jpg', 1),
(3, 'Shawarma Chicken', 'شاورما دجاج', 'Chicken shawarma with garlic sauce', 'شاورما دجاج مع صلصة الثوم', 30.00, '/images/shawarma.jpg', 1),
(4, 'Lemon Mint', 'ليمون نعناع', 'Fresh lemon with mint', 'ليمون طازج مع النعناع', 15.00, '/images/lemon-mint.jpg', 1);