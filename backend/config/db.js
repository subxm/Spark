const { Pool } = require("pg");
require("dotenv").config();

// PostgreSQL connection pool using Supabase connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
    // Run schema updates
    client.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;",
      (queryErr) => {
        release();
        if (queryErr) {
          console.error("❌ Schema update failed:", queryErr.message);
        } else {
          console.log("✅ Schema checked/updated successfully (users.avatar_url ensured)");
        }
      }
    );
  }
});

module.exports = pool;
