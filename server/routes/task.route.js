import express from "express";
const router = express.Router();
import {
  createTask,
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
} from "../controller/task.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/createTask", verifyToken, createTask);
router.get("/getAllTasks", verifyToken, getAllTasks);
router.delete("/deleteTask/:id", verifyToken, deleteTask);
router.patch("/updateTask/:id", verifyToken, updateTask);
router.patch("/updateTaskStatus/:id", verifyToken, updateTaskStatus);

export default router;
