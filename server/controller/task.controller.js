import Task from "../models/task.model.js";
import moment from "moment";
import mongoose from "mongoose";
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
      createdBy: req.user.id,
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

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(errorHandler(404, "Task not found"));
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { filter = "week" } = req.query;
    const userId = req.user.id;
    const userEmail = req.user.email;

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

    const tasks = await Task.find({
      $and: [
        dateFilter,
        {
          $or: [{ createdBy: userId }, { assignedTo: userEmail }],
        },
      ],
    });
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
    const taskId = req.params.id;
    const userId = req.user.id;
    const userEmail = req.user.email;

    const currentTask = await Task.findById(taskId);

    if (!currentTask) {
      return next(errorHandler(404, "Task not found"));
    }

    if (
      currentTask.createdBy.toString() !== userId &&
      currentTask.assignedTo !== userEmail
    ) {
      return next(
        errorHandler(403, "You don't have permission to update this task")
      );
    }

    // If the user is the assigned user (not the creator), prevent changing or removing assignedTo
    if (currentTask.createdBy.toString() !== userId) {
      if (assignedTo !== currentTask.assignedTo) {
        return next(
          errorHandler(
            403,
            "Assigned users cannot change or Remove the assignee"
          )
        );
      }
    }

    const updateObj = {
      title,
      priority,
      checklist,
      status,
      dueDate,
    };

    if (currentTask.createdBy.toString() === userId) {
      updateObj.assignedTo = assignedTo;
    } else {
      updateObj.assignedTo = currentTask.assignedTo;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateObj, {
      new: true,
    });

    res.status(200).json({
      success: true,
      updatedTask: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
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

export const updateSubtaskCompletion = async (req, res, next) => {
  const { taskId, subtaskId } = req.params;
  const { completed } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(subtaskId)
    ) {
      return next({ status: 400, message: "Invalid task or subtask ID" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return next({ status: 404, message: "Task not found" });
    }

    const subtask = task.checklist.find((sub) => sub._id == subtaskId);

    if (!subtask) {
      return next({ status: 404, message: "Subtask not found" });
    }

    if (typeof completed !== "boolean") {
      return next(
        errorHandler(400, "Invalid completion status. Expected boolean.")
      );
    }

    if (completed === subtask.completed) {
      return next(
        errorHandler(409, "Subtask completion status is already " + completed)
      );
    }

    subtask.completed = completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Subtask updated successfully",
      updateSubTask: task,
    });
  } catch (err) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    const tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userEmail }],
    });

    let backlogCount = 0;
    let todoCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let lowPriorityCount = 0;
    let moderatePriorityCount = 0;
    let highPriorityCount = 0;
    let dueDateTasksCount = 0;
    let createdTasksCount = 0;
    let assignedTasksCount = 0;

    tasks.forEach((task) => {
      if (task.createdBy.toString() === userId) {
        createdTasksCount++;
      } else {
        assignedTasksCount++;
      }

      switch (task.status) {
        case "Backlog":
          backlogCount++;
          break;
        case "To do":
          todoCount++;
          break;
        case "In Progress":
          inProgressCount++;
          break;
        case "Done":
          completedCount++;
          break;
        default:
          break;
      }

      switch (task.priority) {
        case "low":
          lowPriorityCount++;
          break;
        case "moderate":
          moderatePriorityCount++;
          break;
        case "high":
          highPriorityCount++;
          break;
        default:
          break;
      }

      if (task.dueDate) {
        dueDateTasksCount++;
      }
    });

    const taskStats = {
      backlogTasks: backlogCount,
      todoTasks: todoCount,
      inProgressTasks: inProgressCount,
      completedTasks: completedCount,
      lowPriorityTasks: lowPriorityCount,
      moderatePriorityTasks: moderatePriorityCount,
      highPriorityTasks: highPriorityCount,
      dueDateTasks: dueDateTasksCount,
      createdTasks: createdTasksCount,
      assignedTasks: assignedTasksCount,
    };

    res.status(200).json({ success: true, analytics: taskStats });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    next(errorHandler(500, "Internal Server Error"));
  }
};
