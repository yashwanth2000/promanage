import Task from "../models/task.model.js";
import errorHandler from "../utils/error.js";

export const createTask = async (req, res, next) => {
    const { title, priority, assignedTo, status, checklist } = req.body;
    try {
        if (!title) {
            return next(errorHandler(400, "Title is required"));
        }

        if (!priority) {
            return next(errorHandler(400, "Priority is required"));
        }

        if(!checklist) {
            return next(errorHandler(400, "Create at least One checklist"));
        }
        const newTask = new Task({
            title,
            priority,
            assignedTo,
            status,
            checklist
        });
        const task = await newTask.save();
        res.status(201).json({ success: true, message: 'Task created successfully', task });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Internal Server Error"));
    }
}

