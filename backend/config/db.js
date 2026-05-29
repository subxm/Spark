const { Pool } = require("pg");
const crypto = require("crypto");
require("dotenv").config();

// PostgreSQL connection pool using Supabase connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// Run schema migrations on startup
const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log("✅ Database connected successfully");

    // 1. Ensure users.avatar_url column exists
    await client.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;"
    );
    console.log("✅ Schema checked/updated successfully (users.avatar_url ensured)");

    // 2. Ensure generations.share_id column exists
    await client.query(
      "ALTER TABLE generations ADD COLUMN IF NOT EXISTS share_id VARCHAR(50);"
    );
    console.log("✅ Schema checked/updated successfully (generations.share_id ensured)");

    // 3. Backfill existing rows that have NULL share_id
    const nullRows = await client.query(
      "SELECT id FROM generations WHERE share_id IS NULL"
    );
    if (nullRows.rows.length > 0) {
      console.log(`🔄 Backfilling ${nullRows.rows.length} generation(s) with share_id...`);
      for (const row of nullRows.rows) {
        const shareId = crypto.randomBytes(8).toString("hex");
        await client.query(
          "UPDATE generations SET share_id = $1 WHERE id = $2",
          [shareId, row.id]
        );
      }
      console.log("✅ Backfill complete");
    }

    // 4. Ensure UNIQUE constraint exists on share_id (idempotent)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'uq_generations_share_id'
        ) THEN
          ALTER TABLE generations ADD CONSTRAINT uq_generations_share_id UNIQUE (share_id);
        END IF;
      END
      $$;
    `);
    console.log("✅ Unique constraint on share_id ensured");

  } catch (err) {
    console.error("❌ Database migration error:", err.message);
  } finally {
    client.release();
  }
};

runMigrations();

module.exports = pool;
