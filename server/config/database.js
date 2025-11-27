const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3308,
  user: process.env.DB_USER || 'barak',
  password: process.env.DB_PASSWORD || 'jronaldo1991',
  database: process.env.DB_NAME || 'agents_calculator',
  charset: 'utf8mb4',
  timezone: '+00:00',
  // Force UTF8MB4 for Hebrew support
  typeCast: function (field, next) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING') {
      return field.string();
    }
    return next();
  }
};

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Additional UTF8MB4 settings
  initSql: [
    "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'",
    "SET CHARACTER SET utf8mb4",
    "SET character_set_connection = utf8mb4"
  ]
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Make sure MySQL is running and credentials are correct');
  }
};

// Initialize connection test
testConnection();

module.exports = pool;
