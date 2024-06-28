import PropTypes from "prop-types";
import styles from "./DeleteTaskModal.module.css";

const DeleteTaskModal = ({ onClose, onDelete }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>Are you sure you want to Delete?</p>
        <div className={styles.modalButtons}>
          <button onClick={onDelete}>Yes, Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
DeleteTaskModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
