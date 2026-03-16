jest.mock("../../../config/dbConnect.js", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import pool from "../../../config/dbConnect.js";
import {
  getAllTasksService,
  createTaskService,
  updateTaskService,
} from "../../../services/taskServices.js";

const mockQuery = pool.query as jest.Mock;

const mockTask = {
  id: 1,
  title: "Buy milk",
  description: "Go to the store",
  status: "pending",
  created_at: new Date("2024-01-01"),
};

describe("getAllTasksService", () => {
  it("should return rows from the database", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

    const result = await getAllTasksService();

    expect(result).toEqual([mockTask]);
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it("should query only pending tasks ordered by created_at DESC limited to 5", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await getAllTasksService();

    const sql: string = mockQuery.mock.calls[0][0] as string;
    expect(sql).toMatch(/WHERE status = 'pending'/i);
    expect(sql).toMatch(/ORDER BY created_at DESC/i);
    expect(sql).toMatch(/LIMIT 5/i);
  });

  it("should propagate errors thrown by the pool", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB connection lost"));

    await expect(getAllTasksService()).rejects.toThrow("DB connection lost");
  });
});

describe("createTaskService", () => {
  it("should insert a new task and return the created row", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

    const result = await createTaskService({
      title: "Buy milk",
      description: "Go to the store",
    });

    expect(result).toEqual(mockTask);
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      ["Buy milk", "Go to the store"],
    );
  });

  it("should propagate errors thrown by the pool", async () => {
    mockQuery.mockRejectedValueOnce(new Error("Unique constraint violation"));

    await expect(
      createTaskService({ title: "T", description: "D" }),
    ).rejects.toThrow("Unique constraint violation");
  });
});

describe("updateTaskService", () => {
  const updatedTask = { ...mockTask, status: "done" };

  it("should update the task status and return the updated row", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [updatedTask] });

    const result = await updateTaskService({ id: "1", status: "done" });

    expect(result).toEqual(updatedTask);
    expect(mockQuery).toHaveBeenCalledWith(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      ["done", "1"],
    );
  });

  it("should return undefined when no task matches the given id", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await updateTaskService({ id: "999", status: "done" });

    expect(result).toBeUndefined();
  });

  it("should propagate errors thrown by the pool", async () => {
    mockQuery.mockRejectedValueOnce(new Error("Update failed"));

    await expect(
      updateTaskService({ id: "1", status: "done" }),
    ).rejects.toThrow("Update failed");
  });
});
