/**
 * Integration tests — the real Express app + router + controllers + services
 * are loaded. Only the PostgreSQL pool is mocked so no database is required.
 */
jest.mock("../../config/dbConnect.js", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

import request from "supertest";
import app from "../../app.js";
import pool from "../../config/dbConnect.js";

const mockQuery = pool.query as jest.Mock;

const mockTask = {
  id: 1,
  title: "Buy milk",
  description: "Go to the store",
  status: "pending",
  created_at: "2024-01-01T00:00:00.000Z",
};

describe("GET /api", () => {
  it("should return 200 with a running message", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Api is running.");
  });
});

describe("GET /api/tasks/all", () => {
  it("should return 200 with an array of pending tasks", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

    const res = await request(app).get("/api/tasks/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 1, title: "Buy milk" })]),
    );
  });

  it("should return an empty array when there are no tasks", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get("/api/tasks/all");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 500 when the database query fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB Error"));

    const res = await request(app).get("/api/tasks/all");

    expect(res.status).toBe(500);
  });
});

describe("POST /api/tasks", () => {
  it("should create a task and return 201 with the created task", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockTask] });

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Buy milk", description: "Go to the store" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, title: "Buy milk", status: "pending" });
  });

  it("should return 500 when the database insert fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("Insert failed"));

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Buy milk", description: "Go to the store" });

    expect(res.status).toBe(500);
  });
});

describe("PUT /api/tasks", () => {
  it("should update a task status and return 200 with the updated task", async () => {
    const updatedTask = { ...mockTask, status: "done" };
    mockQuery.mockResolvedValueOnce({ rows: [updatedTask] });

    const res = await request(app)
      .put("/api/tasks")
      .send({ id: "1", status: "done" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, status: "done" });
  });

  it("should return 500 when the database update fails", async () => {
    mockQuery.mockRejectedValueOnce(new Error("Update failed"));

    const res = await request(app)
      .put("/api/tasks")
      .send({ id: "1", status: "done" });

    expect(res.status).toBe(500);
  });
});
