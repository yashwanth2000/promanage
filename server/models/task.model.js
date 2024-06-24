import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      trim: true,
    },
    checklist: [
      {
        task: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      }
    ],
    assignedTo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      default: "To do",
      required: true,
    },
    dueDate: {
      type: Date,
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
