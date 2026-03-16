import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

if (process.env.NODE_ENV !== "test") {
  void connectDB();
}

export default pool;
