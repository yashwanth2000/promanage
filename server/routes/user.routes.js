import express from "express";
const router = express.Router();
import { updateUser, deleteUser,getUserById } from "../controller/user.controller.js";
import verifyToken from "../utils/verifyToken.js";

router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/get/:id", verifyToken, getUserById);

export default router;
