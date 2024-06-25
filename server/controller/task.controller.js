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
