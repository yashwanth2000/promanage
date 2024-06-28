import express from "express";
const router = express.Router();
import {
  createTask,
  getTaskById,
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
  updateSubtaskCompletion,
  getTaskStats,
} from "../controller/task.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/createTask", verifyToken, createTask);
router.get("/getTaskById/:id", verifyToken, getTaskById);
router.get("/getAllTasks", verifyToken, getAllTasks);
router.delete("/deleteTask/:id", verifyToken, deleteTask);
router.patch("/updateTask/:id", verifyToken, updateTask);
router.patch("/updateTaskStatus/:id", verifyToken, updateTaskStatus);
router.put("/:taskId/subtasks/:subtaskId", updateSubtaskCompletion);
router.get("/analytics", verifyToken, getTaskStats);

export default router;
