import Task from "../models/task.model.js";
import moment from "moment";
import errorHandler from "../utils/error.js";

export const createTask = async (req, res, next) => {
  const { title, priority, assignedTo, status, checklist, dueDate } = req.body;
  try {
    if (!title) {
      return next(errorHandler(400, "Title is required"));
    }

    if (!priority) {
      return next(errorHandler(400, "Priority is required"));
    }

    if (!checklist) {
      return next(errorHandler(400, "Create at least One checklist"));
    }
    const newTask = new Task({
      title,
      priority,
      assignedTo,
      status,
      checklist,
      dueDate,
    });
    const task = await newTask.save();
    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { filter = "week" } = req.query;
    let dateFilter = {};

    switch (filter) {
      case "today":
        dateFilter = {
          createdAt: {
            $gte: moment().startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        };
        break;
      case "week":
        dateFilter = {
          createdAt: {
            $gte: moment().startOf("week").toDate(),
            $lte: moment().endOf("week").toDate(),
          },
        };
        break;
      case "month":
        dateFilter = {
          createdAt: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
          },
        };
        break;
      default:
        dateFilter = {
          createdAt: {
            $gte: moment().startOf("week").toDate(),
            $lte: moment().endOf("week").toDate(),
          },
        };
        break;
    }

    const tasks = await Task.find(dateFilter);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deleteTask = await Task.findById(req.params.id);

    if (!deleteTask) {
      return next(errorHandler(404, "Task not found"));
    }

    await Task.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, priority, assignedTo, checklist, status, dueDate } =
      req.body;

    const currentTask = await Task.findById(req.params.id);

    if (!currentTask) {
      return next(errorHandler(404, "Task not found"));
    }

    if (
      title === currentTask.title &&
      priority === currentTask.priority &&
      assignedTo === currentTask.assignedTo &&
      JSON.stringify(checklist) === JSON.stringify(currentTask.checklist) &&
      status === currentTask.status &&
      dueDate === currentTask.dueDate
    ) {
      return res.status(400).json({
        success: false,
        message: "No changes detected. Task data is the same.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, priority, assignedTo, checklist, status, dueDate },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedTask: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }

    res.status(200).json({
      success: true,
      updatedTaskStatus: status,
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
