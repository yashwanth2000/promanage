import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import plusIcon from "../../../../assets/plus.png";
import deleteIcon from "../../../../assets/delete.png";
import downArrow from "../../../../assets/arrowDown.png";
import { getTaskById, updateTask } from "../../../../utils/task";
import styles from "./UpdateTaskModal.module.css";

const UpdateTaskModal = ({
  isOpen,
  onClose,
  taskId,
  addedEmails,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    assignedTo: "",
    checklist: [],
    dueDate: null,
  });

  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [error, setError] = useState({
    title: "",
    priority: "",
    checklist: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const task = await getTaskById(taskId);
        setFormData({
          title: task.title || "",
          priority: task.priority
            ? task.priority.toUpperCase() + " PRIORITY"
            : "",
          assignedTo: task.assignedTo || "",
          checklist: task.checklist || [],
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
        });
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleInputChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  const handleAddChecklistItem = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      checklist: [...prevFormData.checklist, { task: "", completed: false }],
    }));
    setError((prevError) => ({
      ...prevError,
      checklist: "",
    }));
  };

  const handleChecklistItemChange = (index, value) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index].task = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      checklist: updatedChecklist,
    }));
    setError((prevError) => ({
      ...prevError,
      checklist: "",
    }));
  };

  const handleChecklistItemToggle = (index) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;
    setFormData((prevFormData) => ({
      ...prevFormData,
      checklist: updatedChecklist,
    }));
  };

  const handleChecklistItemDelete = (index) => {
    const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      checklist: updatedChecklist,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      priority: "",
      assignedTo: "",
      checklist: [],
      dueDate: null,
    });
    onClose();
  };

  const handleUpdate = async () => {
    if (!formData.title) {
      setError((prevError) => ({
        ...prevError,
        title: "Title is required",
      }));
      return;
    }

    if (!formData.priority) {
      setError((prevError) => ({
        ...prevError,
        priority: "Priority is required",
      }));
      return;
    }

    if (formData.checklist.length === 0) {
      setError((prevError) => ({
        ...prevError,
        checklist: "Create at least one subtask",
      }));
      return;
    }

    const emptyChecklistItems = formData.checklist.filter(
      (item) => item.task.trim() === ""
    );

    if (emptyChecklistItems.length > 0) {
      setError((prevError) => ({
        ...prevError,
        checklist: "Each subtask must have a name",
      }));
      return;
    }

    let priorityValue = formData.priority.split(" ")[0].toLowerCase();

    const formattedData = {
      ...formData,
      priority: priorityValue,
    };

    try {
      await updateTask(taskId, formattedData);
      onUpdateSuccess("Task updated successfully");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        onUpdateSuccess(error.response.data.message, true);
      } else {
        onUpdateSuccess("Error updating task. Please try again.", true);
      }
    }
  };

  const handleRemoveAssignee = () => {
    handleInputChange("assignedTo", "");
  };
  const handleAssigneeSelect = (email) => {
    handleInputChange("assignedTo", email);
    setIsAssigneeDropdownOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div className={styles.taskTitle}>
            <label htmlFor="taskTitle" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              value={formData.title}
              required
              name="taskTitle"
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={styles.inputField}
            />
            {error.title && <p className={styles.error}>{error.title}</p>}
          </div>

          <div className={styles.prioritySection}>
            <div className={styles.priorityContent}>
              <p className={styles.priorityTitle}>
                Select Priority <span className={styles.required}>*</span>
              </p>
              <div className={styles.priorityButtons}>
                {["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"].map(
                  (p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleInputChange("priority", p)}
                      className={`${styles.priorityButton} ${
                        p === "HIGH PRIORITY"
                          ? styles.highPriority
                          : p === "MODERATE PRIORITY"
                          ? styles.moderatePriority
                          : styles.lowPriority
                      } ${formData.priority === p ? styles.selected : ""}`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
            {error.priority && <p className={styles.error}>{error.priority}</p>}
          </div>

          <div className={styles.assignSection}>
            <div className={styles.assignHeader}>
              <p>Assign to</p>
              <div
                className={styles.assignDropdown}
                onClick={() => {
                  setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                }}
              >
                <span>{formData.assignedTo || "Add an assignee"}</span>
                <img
                  src={downArrow}
                  className={styles.downArrow}
                  alt="Down Arrow"
                />
              </div>
            </div>
            {isAssigneeDropdownOpen && (
              <div className={styles.dropdownList}>
                {addedEmails.map((email) => (
                  <div
                    key={email}
                    className={styles.dropdownItem}
                    onClick={() => handleAssigneeSelect(email)}
                  >
                    <span className={styles.assigneeInitials}>
                      {email.substring(0, 2).toUpperCase()}
                    </span>
                    <span className={styles.emailText}>{email}</span>
                    <button className={styles.assignButton}>Assign</button>
                  </div>
                ))}
              </div>
            )}
            {formData.assignedTo && (
              <button
                type="button"
                onClick={handleRemoveAssignee}
                className={styles.removeAssigneeButton}
              >
                Remove Assignee
              </button>
            )}
          </div>

          <div className={styles.checklistContainer}>
            <div className={styles.checklistSection}>
              <p className={styles.checklistTitle}>
                Checklist (
                {formData.checklist.filter((item) => item.completed).length}/
                {formData.checklist.length}){" "}
                <span className={styles.required}>*</span>
              </p>
              {formData.checklist.map((item, index) => (
                <div key={index} className={styles.checklistItem}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistItemToggle(index)}
                    className={styles.checkbox}
                  />
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) =>
                      handleChecklistItemChange(index, e.target.value)
                    }
                    className={`${styles.checklistItemInput} ${
                      item.completed ? styles.doneTask : ""
                    }`}
                    placeholder="Add a Task"
                  />
                  <img
                    src={deleteIcon}
                    alt="delete"
                    className={styles.deleteIcon}
                    onClick={() => handleChecklistItemDelete(index)}
                  />
                </div>
              ))}
            </div>

            {error.checklist && (
              <p className={styles.error}>{error.checklist}</p>
            )}
            <div
              className={styles.addChecklistItem}
              onClick={handleAddChecklistItem}
            >
              <img src={plusIcon} alt="plus" className={styles.plusIcon} />
              <span className={styles.addNewText}>Add New</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <div className={styles.dueDateSection}>
              <DatePicker
                selected={formData.dueDate}
                onChange={(date) => handleInputChange("dueDate", date)}
                placeholderText="Select Due Date"
                dateFormat={"dd/MM/yyyy"}
                className={styles.datePicker}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className={styles.saveButton}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  taskId: PropTypes.string.isRequired,
  addedEmails: PropTypes.array.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default UpdateTaskModal;
