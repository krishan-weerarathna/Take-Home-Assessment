import type { Request, Response, NextFunction } from "express";

import {
  getAllTasksService,
  createTaskService,
  updateTaskService,
} from "../services/taskServices.js";
import type { CreateTaskType, UpdateTaskType } from "../types/taskTypes.js";

export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tasks = await getAllTasksService();
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const createBody = req.body;
  try {
    const newTask = await createTaskService(createBody as CreateTaskType);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const updateBody = req.body;
  try {
    const updatedTask = await updateTaskService(updateBody as UpdateTaskType);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
