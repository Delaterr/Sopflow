-- SQL schema based on the application's data model.

-- Table for shops
-- Each user can own one shop.
CREATE TABLE shops (
    id VARCHAR(255) PRIMARY KEY,
    owner_uid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    hero_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for product categories
-- Categories belong to a specific shop.
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    shop_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- Table for products
-- Products belong to a specific shop and a specific category.
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    shop_id VARCHAR(255) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE, -- For barcodes/SKUs
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sales_price DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2),
    quantity INT NOT NULL,
    unit VARCHAR(50),
    image_url TEXT,
    image_hint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Indexes for frequent lookups
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_categories_shop_id ON categories(shop_id);
CREATE INDEX idx_shops_owner_uid ON shops(owner_uid);
