import { useState, useEffect ,} from "react";
import NavBar from "../Navbar/NavBar";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import peopleIcon from "../../../assets/addpeople.png";
import collapseAllIcon from "../../../assets/collapse-all.png";
import plusIcon from "../../../assets/plus.png";
import downArrow from "../../../assets/arrowDown.png";
import moreIcon from "../../../assets/threeDot.png";
import AddPeopleModal from "./AddPeopleModal";
import CreateTaskModal from "./CreateTaskModal";
import { createTask, getAllTasks, deleteTask } from "../../../utils/task";
import styles from "./Board.module.css";

const Board = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [addedEmails, setAddedEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const [visibleSubtasks, setVisibleSubtasks] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleMenuToggle = (taskId, event) => {
    setActiveMenu(activeMenu === taskId ? null : taskId);
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const handleMenuAction = (action, taskId) => {
    console.log(action, taskId);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (location.state?.loggedIn) {
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }

    const storedEmails = JSON.parse(localStorage.getItem("addedEmails")) || [];
    setAddedEmails(storedEmails);

    fetchTasks();
  }, [location.state, timeFilter]);

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks(timeFilter);
      setTasks(response.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    }
  };

  const toggleAddPeopleModal = () => {
    setShowAddPeopleModal(!showAddPeopleModal);
  };

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleAddPeople = (email) => {
    const updatedEmails = [...addedEmails, email];
    setAddedEmails(updatedEmails);
    localStorage.setItem("addedEmails", JSON.stringify(updatedEmails));
  };

  const handleSaveTask = async (taskData) => {
    try {
      const task = await createTask(taskData);
      if (task) {
        toast.success("Task created successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to create task", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      console.error("Error creating task:", error);
    }
    setShowCreateTaskModal(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  const handleShowSubTasks = (taskId) => {
    setVisibleSubtasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const options = { day: "2-digit", month: "short", year: "numeric" };

  const formattedDate = new Date()
    .toLocaleDateString("en-GB", options)
    .replace(/ /g, ", ");

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

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getPriorityLabel = (priority) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "LOW PRIORITY";
      case "moderate":
        return "MODERATE PRIORITY";
      case "high":
        return "HIGH PRIORITY";
    }
  };

  const getInitials = (email) => {
    const [name] = email.split("@");
    return name.substring(0, 2).toUpperCase();
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    console.log(`Toggled subtask ${subtaskId} for task ${taskId}`);
  };

  const renderTasks = (status) => {
    return tasks
      .filter((task) => task.status.toLowerCase() === status.toLowerCase())
      .map((task) => (
        <div key={task._id} className={styles.taskCard}>
          <div className={styles.taskHeader}>
            <div className={styles.priorityContainer}>
              <div
                className={`${styles.priorityIndicator} ${
                  styles[task.priority.toLowerCase()]
                }`}
              />
              <p className={styles.priorityLabel}>
                {getPriorityLabel(task.priority)}
              </p>
              {task.assignedTo && (
                <div className={styles.assigneeAvatar}>
                  {getInitials(task.assignedTo)}
                </div>
              )}
            </div>
            <img
              src={moreIcon}
              alt="More"
              className={styles.moreIcon}
              onClick={(e) => handleMenuToggle(task._id, e)}
            />
            {activeMenu === task._id && (
              <div
                className={styles.taskMenu}
                style={{ top: menuPosition.top + 24, left: menuPosition.left }}
              >
                <p onClick={() => handleMenuAction("edit", task._id)}>Edit</p>
                <p onClick={() => handleMenuAction("share", task._id)}>Share</p>
                <p
                  onClick={() => handleDeleteTask(task._id)}
                  className={styles.delete}
                >
                  Delete
                </p>
              </div>
            )}
          </div>
          <h4>{task.title}</h4>
          <div className={styles.taskChecklistContainer}>
            <div className={styles.taskChecklist}>
              <p>
                Checklist (
                {task.checklist.filter((item) => item.completed).length}/
                {task.checklist.length})
              </p>
              <img
                src={downArrow}
                alt="Down Arrow"
                className={`${styles.downArrow} ${
                  visibleSubtasks[task._id] ? styles.rotated : ""
                }`}
                onClick={() => handleShowSubTasks(task._id)}
              />
            </div>
            {visibleSubtasks[task._id] && (
              <div className={styles.subtaskList}>
                {task.checklist.map((item) => (
                  <div key={item._id} className={styles.subtaskItem}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleSubtaskToggle(task._id, item._id)}
                      className={styles.subtaskCheckbox}
                    />
                    <span className={styles.subtaskText}>{item.task}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.taskFooter}>
            <span
              className={`${styles.dueDate} ${
                task.dueDate
                  ? isPastDate(task.dueDate)
                    ? styles.pastDueDate
                    : ""
                  : styles.hidden
              }`}
            >
              {task.dueDate && formattedDueDate(task.dueDate)}
            </span>
            <div className={styles.statusContainer}>
              <span
                className={
                  status.toLowerCase() === "backlog" ? styles.activeStatus : ""
                }
              >
                BACKLOG
              </span>
              <span
                className={
                  status.toLowerCase() === "in progress"
                    ? styles.activeStatus
                    : ""
                }
              >
                PROGRESS
              </span>
              <span
                className={
                  status.toLowerCase() === "done" ? styles.activeStatus : ""
                }
              >
                DONE
              </span>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className={styles.boardContainer}>
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1>Welcome! {user.name}</h1>
            <p>{formattedDate}</p>
          </header>
          <div className={styles.boardHeader}>
            <div className={styles.boardHeaderLeft}>
              <h2>Board</h2>
              <img src={peopleIcon} alt="Add" className={styles.peopleIcon} />
              <button
                className={styles.addButton}
                onClick={toggleAddPeopleModal}
              >
                Add People
              </button>
            </div>
            <select
              className={styles.timeFilter}
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
          <div className={styles.columns}>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>Backlog</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {renderTasks("Backlog")}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>To do</h3>
                <div>
                  <img
                    src={plusIcon}
                    alt="Plus"
                    className={styles.plusIcon}
                    onClick={handleOpenCreateTaskModal}
                  />
                  <img src={collapseAllIcon} alt="Collapse All" />
                </div>
              </div>
              {renderTasks("To do")}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>In Progress</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {renderTasks("In progress")}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>Done</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {renderTasks("Done")}
            </div>
          </div>
        </main>
      </div>
      <AddPeopleModal
        show={showAddPeopleModal}
        onClose={toggleAddPeopleModal}
        onAdd={handleAddPeople}
      />
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSave={handleSaveTask}
        addedEmails={addedEmails}
      />
    </>
  );
};

export default Board;
