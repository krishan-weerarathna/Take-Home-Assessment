import express from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/all").get(getAllTasks);
router.route("").post(createTask);
router.route("").put(updateTask);

export default router;
