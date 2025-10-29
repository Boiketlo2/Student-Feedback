const { Pool } = require('pg');
require('dotenv').config();

// Use connection string with IPv4 forcing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Force IPv4
  family: 4
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database successfully!');
    release();
  }
});

// Create table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    "studentName" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    comments TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
  );
`;

pool.query(createTableQuery)
  .then(() => console.log('✅ Feedback table is ready'))
  .catch(err => console.error('❌ Error creating table:', err));

module.exports = pool;