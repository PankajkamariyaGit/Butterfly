import { NextResponse } from "next/server";
import { execute } from "@/lib/db";

export async function POST() {
  try {
    // Products table
    await execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2) DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        category_slug VARCHAR(100) NOT NULL,
        stock INT DEFAULT 0,
        badge VARCHAR(50) DEFAULT NULL,
        description TEXT,
        material VARCHAR(255) DEFAULT '',
        care_instructions TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INT DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        bestseller BOOLEAN DEFAULT FALSE,
        new_arrival BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        sku VARCHAR(50) DEFAULT '',
        tags JSON,
        video_url VARCHAR(500) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Product images table
    await execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        image_url VARCHAR(1000) NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Orders table
    await execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) DEFAULT '',
        shipping_address TEXT,
        items JSON NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        shipping DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
        payment_method VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({ success: true, message: "Database tables created successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
