import express from "express";
const router = express.Router();
import { createTask } from "../controller/task.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.post("/createTask", verifyToken, createTask);

export default router;