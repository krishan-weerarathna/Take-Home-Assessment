import pool from "../config/dbConnect.js";

import type { CreateTaskType, UpdateTaskType } from "../types/taskTypes.js";

export const getAllTasksService = async () => {
  const result = await pool.query(`
  SELECT * 
  FROM tasks
  WHERE status = 'pending'
  ORDER BY created_at DESC
  LIMIT 5
`);
  return result.rows;
};

export const createTaskService = async (createBody: CreateTaskType) => {
  const { title, description } = createBody;
  const result = await pool.query(
    "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
    [title, description],
  );
  return result.rows[0];
};

export const updateTaskService = async (updateBody: UpdateTaskType) => {
  const { id, status } = updateBody;
  const result = await pool.query(
    "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
    [status, id],
  );
  return result.rows[0];
};
