import express from "express";
const router = express.Router();
import { createTask, getAllTasks } from "../controller/task.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/createTask", verifyToken, createTask);
router.get("/getAllTasks", verifyToken, getAllTasks);

export default router;
