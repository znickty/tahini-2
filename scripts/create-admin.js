const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'tahini_user',
    password: process.env.DATABASE_PASSWORD || 'tahini_password',
    database: process.env.DATABASE_NAME || 'tahini_house',
  });

  try {
    // Check if admin_users table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'admin_users'"
    );

    if (tables.length === 0) {
      console.log('Creating admin_users table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    // Check if admin exists
    const [admins] = await connection.query(
      "SELECT * FROM admin_users WHERE email = ?",
      ['admin@tahinihouse.com']
    );

    if (admins.length === 0) {
      // Create admin user
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        `INSERT INTO admin_users (email, password_hash, name, role, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        ['admin@tahinihouse.com', hashedPassword, 'Admin', 'admin', true]
      );
      
      console.log('Admin user created successfully!');
      console.log('Email: admin@tahinihouse.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await connection.end();
  }
}

createAdminUser();