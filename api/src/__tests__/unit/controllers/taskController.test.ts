jest.mock("../../../services/taskServices.js", () => ({
  getAllTasksService: jest.fn(),
  createTaskService: jest.fn(),
  updateTaskService: jest.fn(),
}));

import type { Request, Response, NextFunction } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
} from "../../../controllers/taskController.js";
import {
  getAllTasksService,
  createTaskService,
  updateTaskService,
} from "../../../services/taskServices.js";

const mockGetAll = getAllTasksService as jest.Mock;
const mockCreate = createTaskService as jest.Mock;
const mockUpdate = updateTaskService as jest.Mock;

const makeMockRes = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const task = {
  id: 1,
  title: "Buy milk",
  description: "Go to the store",
  status: "pending",
  created_at: new Date("2024-01-01"),
};

describe("getAllTasks controller", () => {
  it("should respond with 200 and the tasks array", async () => {
    mockGetAll.mockResolvedValueOnce([task]);
    const req = {} as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await getAllTasks(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([task]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error when the service throws", async () => {
    const error = new Error("Service error");
    mockGetAll.mockRejectedValueOnce(error);
    const req = {} as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await getAllTasks(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("createTask controller", () => {
  it("should respond with 201 and the created task", async () => {
    mockCreate.mockResolvedValueOnce(task);
    const req = {
      body: { title: "Buy milk", description: "Go to the store" },
    } as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await createTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(task);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error when the service throws", async () => {
    const error = new Error("Create failed");
    mockCreate.mockRejectedValueOnce(error);
    const req = { body: {} } as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await createTask(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("updateTask controller", () => {
  const updatedTask = { ...task, status: "done" };

  it("should respond with 200 and the updated task", async () => {
    mockUpdate.mockResolvedValueOnce(updatedTask);
    const req = { body: { id: "1", status: "done" } } as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await updateTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTask);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with the error when the service throws", async () => {
    const error = new Error("Update failed");
    mockUpdate.mockRejectedValueOnce(error);
    const req = { body: {} } as Request;
    const res = makeMockRes();
    const next = jest.fn() as unknown as NextFunction;

    await updateTask(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });
});
