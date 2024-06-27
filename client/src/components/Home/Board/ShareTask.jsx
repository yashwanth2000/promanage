import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logoIcon from "../../../assets/logo.png";
import { getTaskById } from "../../../utils/task";
import styles from "./ShareTask.module.css";

const ShareTask = () => {
  const { id } = useParams();

  const [taskData, setTaskData] = useState({
    title: "",
    priority: null,
    assignedTo: "",
    checklist: [],
    dueDate: null,
  });

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTaskById(id);
      setTaskData({
        title: task.title,
        priority: task.priority,
        assignedTo: task.assignedTo,
        checklist: task.checklist,
        dueDate: task.dueDate,
      });
    };
    fetchTask();
  }, [id]);

  if (!taskData) {
    return <p className={styles.loading}>Loading...</p>;
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "low":
        return "LOW PRIORITY";
      case "moderate":
        return "MODERATE PRIORITY";
      case "high":
        return "HIGH PRIORITY";
      default:
        return "";
    }
  };

  const getInitials = (email) => {
    const [name] = email.split("@");
    return name.substring(0, 2).toUpperCase();
  };

  const formattedDueDate = (date) => {
    if (!date) return;

    const options = { month: "short", day: "numeric" };
    const [day, month] = new Date(date)
      .toLocaleDateString("en-GB", options)
      .split(" ");
    const dayWithSuffix = addSuffix(parseInt(day));
    return `${month} ${dayWithSuffix}`;
  };

  const addSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const handleCheckboxClick = () => {
    toast.error("Public Page, Read Only!", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
        <h2 className={styles.title}>ProManage</h2>
      </div>

      <div className={styles.shareTaskContainer}>
        <div className={styles.content}>
          <div className={styles.priorityContainer}>
            <div
              className={`${styles.priorityIndicator} ${
                styles[taskData.priority]
              }`}
            />
            <p className={styles.priorityLabel}>
              {getPriorityLabel(taskData.priority)}
            </p>
            {taskData.assignedTo && (
              <div className={styles.assigneeAvatar}>
                {getInitials(taskData.assignedTo)}
              </div>
            )}
          </div>
          <h4 className={styles.taskTitle}>{taskData.title}</h4>

          <div className={styles.taskChecklistContainer}>
            <p>
              Checklist (
              {taskData.checklist.filter((item) => item.completed).length}/
              {taskData.checklist.length})
            </p>
            {taskData.checklist.map((item) => (
              <div key={item._id} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  className={styles.subtaskCheckbox}
                  readOnly
                  onClick={handleCheckboxClick}
                />
                <span className={styles.subtaskText}>{item.task}</span>
              </div>
            ))}
          </div>

          {taskData.dueDate && (
            <div className={styles.dueDate}>
              Due Date: <span>{formattedDueDate(taskData.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShareTask;
