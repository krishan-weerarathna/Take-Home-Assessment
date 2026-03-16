import pool from "../config/dbConnect.js";

const createTaskTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'done')),
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  try {
    await pool.query(query);
    console.log("Tasks table created successfully");
  } catch (error) {
    console.error("Error creating tasks table:", error);
  }
};

export default createTaskTable;
