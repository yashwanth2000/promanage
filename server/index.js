import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.route.js";
import path from "path";

dotenv.config({ path: "../.env" });
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB");
    console.error(err);
  });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

const frontEndPath = path.join(__dirname, "../client/dist");

app.use(express.static(frontEndPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontEndPath, "index.html"));
})

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
