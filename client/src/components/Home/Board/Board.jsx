import { useState, useEffect, useRef } from "react";
import NavBar from "../Navbar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import peopleIcon from "../../../assets/addpeople.png";
import collapseAllIcon from "../../../assets/collapse-all.png";
import plusIcon from "../../../assets/plus.png";
import downArrow from "../../../assets/arrowDown.png";
import moreIcon from "../../../assets/threeDot.png";
import AddPeopleModal from "./AddPeople/AddPeopleModal.jsx";
import CreateTaskModal from "./CreateTask/CreateTaskModal.jsx";
import UpdateTaskModal from "./UpdateTask/UpdateTaskModal.jsx";
import {
  createTask,
  getAllTasks,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
} from "../../../utils/task";
import copy from "copy-to-clipboard";
import { Tooltip } from "react-tooltip";
import styles from "./Board.module.css";
import DeleteTaskModal from "./DeleteTaskModal.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [addedEmails, setAddedEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskCounts, setTaskCounts] = useState({
    backlog: 0,
    todo: 0,
    inprogress: 0,
    done: 0,
  });

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

      navigate(location.pathname, { replace: true });
    }

    const storedEmails = JSON.parse(localStorage.getItem("addedEmails")) || [];
    setAddedEmails(storedEmails);

    fetchTasks();
  }, [location.state, timeFilter, navigate, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTasks = async (shouldSetLoading = true) => {
    try {
      if (shouldSetLoading) setIsLoading(true);

      const response = await getAllTasks(timeFilter);
      setTasks(response.tasks);

      const counts = response.tasks.reduce((acc, task) => {
        const status = task.status.toLowerCase().replace(/\s+/g, "");
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      setTaskCounts({
        backlog: counts.backlog || 0,
        todo: counts.todo || 0,
        inprogress: counts.inprogress || 0,
        done: counts.done || 0,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    } finally {
      if (shouldSetLoading) setIsLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // Prevent drops outside a droppable area or within the same column
    if (!destination || source.droppableId === destination.droppableId) return;

    const draggedTask = tasks.find((task) => task._id === result.draggableId);

    if (!draggedTask) {
      console.error("Could not find dragged task");
      return;
    }

    // update local state
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === draggedTask._id
          ? { ...task, status: destination.droppableId }
          : task
      )
    );

    try {
      await updateTaskStatus(draggedTask._id, destination.droppableId);

      // toast.info(`Task status updated to ${destination.droppableId}`, {
      //   position: "top-right",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      //   draggable: true,
      //   theme: "light",
      // });
      
      // Fetch tasks in the background to ensure consistency
      fetchTasks(false);
    } catch (error) {
      console.error("Drag and drop update failed:", error);
      toast.error("Failed to update task status", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleMenuToggle = (taskId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === taskId ? null : taskId);
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const handleMenuAction = (action, taskId) => {
    if (action === "edit") {
      setSelectedTaskId(taskId);
      setShowUpdateTaskModal(true);
    } else if (action === "delete") {
      const task = tasks.find((task) => task._id === taskId);
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
    setActiveMenu(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateTaskModal(false);
    setSelectedTaskId(null);
  };

  const toggleAddPeopleModal = () => {
    setShowAddPeopleModal(!showAddPeopleModal);
  };

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleAddPeople = (email) => {
    const lowerCaseEmail = email.toLowerCase();

    if (!addedEmails.includes(lowerCaseEmail)) {
      const updatedEmails = [...addedEmails, lowerCaseEmail];
      setAddedEmails(updatedEmails);
      localStorage.setItem("addedEmails", JSON.stringify(updatedEmails));
    }
  };

  const handleShowSubTasks = (taskId) => {
    setExpandedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleCollapseAll = (status) => {
    const tasksInColumn = tasks.filter(
      (task) => task.status.toLowerCase() === status.toLowerCase()
    );
    const updatedExpandedTasks = { ...expandedTasks };
    tasksInColumn.forEach((task) => {
      updatedExpandedTasks[task._id] = false;
    });
    setExpandedTasks(updatedExpandedTasks);
  };

  //util functions
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

  //Updates
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
        autoClose: 1000,
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
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  const handleShareClick = (taskId) => {
    const url = import.meta.env.VITE_SHARE_URL + `/share/${taskId}`;

    try {
      const success = copy(url);
      if (success) {
        toast.success("Link copied to clipboard", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
      } else {
        toast.error("Failed to copy. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }

    setActiveMenu(null);
  };

  const handleSubtaskToggle = async (taskId, subtaskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const subtask = task.checklist.find((st) => st._id === subtaskId);
      const newCompletionStatus = !subtask.completed;

      const response = await updateTaskChecklist(taskId, subtaskId, {
        completed: newCompletionStatus,
      });

      if (response.success) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((st) =>
                    st._id === subtaskId
                      ? { ...st, completed: newCompletionStatus }
                      : st
                  ),
                }
              : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task status", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  const handleUpdateSuccess = (message, isError = false) => {
    if (isError) {
      toast.error(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } else {
      toast.success(message, {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
    fetchTasks();
  };

  // render tasks
  const renderTasks = (status) => {
    const statusOptions = ["Backlog", "To do", "In Progress", "Done"];
    const statusKey = status.toLowerCase().replace(/\s+/g, "");
    const count = taskCounts[statusKey || 0] || 2;

    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {Array(count)
            .fill(0)
            .map((_, index) => (
              <div
                key={`skeleton-${status}-${index}`}
                style={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "20px",
                  padding: "12px",
                  height: "180px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Title */}
                <Skeleton
                  height={24}
                  width="80%"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
                  style={{ marginBottom: "20px" }}
                />

                {/* Checklist */}
                <Skeleton
                  height={16}
                  width="40%"
                  baseColor="#e0e0e0"
                  highlightColor="#f0f0f0"
                  style={{ marginBottom: "30px" }}
                />

                {/* Checklist Items */}
                {[...Array(2)].map((_, itemIndex) => (
                  <div
                    key={`checklist-item-${itemIndex}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Skeleton
                      height={16}
                      width={16}
                      circle
                      baseColor="#e0e0e0"
                      highlightColor="#f0f0f0"
                      style={{ marginRight: "10px" }}
                    />
                    <Skeleton
                      height={12}
                      width="70%"
                      baseColor="#e0e0e0"
                      highlightColor="#f0f0f0"
                    />
                  </div>
                ))}

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    height={20}
                    width="30%"
                    baseColor="#e0e0e0"
                    highlightColor="#f0f0f0"
                  />
                  <Skeleton
                    height={20}
                    width="40%"
                    baseColor="#e0e0e0"
                    highlightColor="#f0f0f0"
                  />
                </div>
              </div>
            ))}
        </div>
      );
    }

    return (
      <Droppable
        droppableId={status}
        type="TASK"
        isDropDisabled={false}
        ignoreContainerClipping
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: "100px",
              transition: "background-color 0.2s ease",
              backgroundColor: snapshot.isDraggingOver
                ? "rgba(135, 206, 250, 0.2)"
                : "transparent",
              borderRadius: "20px",
            }}
          >
            {tasks
              .filter(
                (task) => task.status.toLowerCase() === status.toLowerCase()
              )
              .map((task, index) => {
                const otherStatuses = statusOptions.filter(
                  (s) => s.toLowerCase() !== task.status.toLowerCase()
                );

                const truncatedTitle =
                  task.title.split(" ").slice(0, 3).join(" ") +
                  (task.title.split(" ").length > 3 ? " ..." : "");

                return (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                    type="TASK"
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.taskCard}
                        style={{
                          ...provided.draggableProps.style,
                          // Add a shadow when dragging
                          boxShadow: snapshot.isDragging
                            ? "0 0 10px rgba(0,0,0,0.3)"
                            : "none",
                        }}
                      >
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
                              <div
                                className={styles.assigneeAvatar}
                                data-tooltip-id={`assignee-${task._id}`}
                                data-tooltip-content={task.assignedTo}
                              >
                                {getInitials(task.assignedTo)}
                              </div>
                            )}
                            <Tooltip id={`assignee-${task._id}`} />
                          </div>
                          <img
                            src={moreIcon}
                            alt="More"
                            className={styles.moreIcon}
                            onClick={(e) => handleMenuToggle(task._id, e)}
                          />
                          {activeMenu === task._id && (
                            <div
                              ref={menuRef}
                              className={styles.taskMenu}
                              style={{
                                top: menuPosition.top + 10,
                                left: menuPosition.left - 80,
                              }}
                            >
                              <p
                                onClick={() =>
                                  handleMenuAction("edit", task._id)
                                }
                              >
                                Edit
                              </p>
                              <p onClick={() => handleShareClick(task._id)}>
                                Share
                              </p>
                              <p
                                onClick={() =>
                                  handleMenuAction("delete", task._id)
                                }
                                className={styles.delete}
                              >
                                Delete
                              </p>
                            </div>
                          )}
                        </div>
                        <h4
                          className={styles.taskTitle}
                          data-tooltip-id={`title-${task._id}`}
                          data-tooltip-content={task.title}
                        >
                          {truncatedTitle}
                        </h4>
                        <Tooltip id={`title-${task._id}`} />
                        <div className={styles.taskChecklistContainer}>
                          <div className={styles.taskChecklist}>
                            <p>
                              Checklist (
                              {
                                task.checklist.filter((item) => item.completed)
                                  .length
                              }
                              /{task.checklist.length})
                            </p>
                            <img
                              src={downArrow}
                              alt="Down Arrow"
                              className={`${styles.downArrow} ${
                                expandedTasks[task._id] ? styles.rotated : ""
                              }`}
                              onClick={() => handleShowSubTasks(task._id)}
                            />
                          </div>
                          {expandedTasks[task._id] && (
                            <div className={styles.subtaskList}>
                              {task.checklist.map((item) => (
                                <div
                                  key={item._id}
                                  className={styles.subtaskItem}
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() =>
                                      handleSubtaskToggle(task._id, item._id)
                                    }
                                    className={styles.subtaskCheckbox}
                                  />
                                  <span className={styles.subtaskText}>
                                    {item.task}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={styles.taskFooter}>
                          {task.dueDate ? (
                            <span
                              className={`${styles.dueDate} ${
                                task.status.toLowerCase() === "done"
                                  ? styles.doneDueDate
                                  : isPastDate(task.dueDate)
                                  ? styles.pastDueDate
                                  : ""
                              }`}
                            >
                              {formattedDueDate(task.dueDate)}
                            </span>
                          ) : (
                            <div className={styles.dueDatePlaceholder}></div>
                          )}

                          <div className={styles.statusContainer}>
                            {otherStatuses.map((statusOption) => (
                              <span
                                key={statusOption}
                                className={
                                  statusOption.toLowerCase() ===
                                  task.status.toLowerCase()
                                    ? styles.activeStatus
                                    : ""
                                }
                                onClick={() =>
                                  handleStatusChange(task._id, statusOption)
                                }
                              >
                                {statusOption.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  // Main return statement
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      dragHandleSelector=".task-drag-handle"
    >
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
                className={styles.addPeopleButton}
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
          <div className={styles.columnsWrapper}>
            <div className={styles.columns}>
              {["Backlog", "To do", "In Progress", "Done"].map((status) => (
                <div key={status} className={styles.column}>
                  <div className={styles.taskHeader}>
                    <h3>{status}</h3>
                    <div>
                      {status === "To do" && (
                        <img
                          src={plusIcon}
                          alt="Plus"
                          className={styles.plusIcon}
                          onClick={handleOpenCreateTaskModal}
                        />
                      )}
                      <img
                        src={collapseAllIcon}
                        alt="Collapse All"
                        className={styles.collapseAllIcon}
                        onClick={() => handleCollapseAll(status)}
                      />
                    </div>
                  </div>
                  {renderTasks(status)}
                </div>
              ))}
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
      {showUpdateTaskModal && selectedTaskId && (
        <UpdateTaskModal
          isOpen={showUpdateTaskModal}
          onClose={handleCloseUpdateModal}
          taskId={selectedTaskId}
          addedEmails={addedEmails}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      {showDeleteModal && (
        <DeleteTaskModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            handleDeleteTask(taskToDelete._id);
            setShowDeleteModal(false);
          }}
        />
      )}
    </DragDropContext>
  );
};

export default Board;
