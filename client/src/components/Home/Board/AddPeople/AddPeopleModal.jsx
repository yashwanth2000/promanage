import { useState } from "react";
import styles from "./AddPeopleModal.module.css";
import PropTypes from "prop-types";

const AddPeopleModal = ({ show, onAdd, onClose }) => {
  const [email, setEmail] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleAddClick = () => {
    if (email.trim() === "") {
      setError("Email cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirmClick = () => {
    onAdd(email);
    setIsConfirming(false);
    setEmail("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {!isConfirming ? (
          <>
            <h2>Add people to the board</h2>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={handleEmailChange}
              className={styles.emailInput}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttonContainer}>
              <button onClick={onClose} className={styles.closeButton}>
                Cancel
              </button>
              <button onClick={handleAddClick} className={styles.addButton}>
                Add Email
              </button>
            </div>
          </>
        ) : (
          <div className={styles.confirmContainer}>
            <h2 className={styles.confirmText}>{email}</h2>
            <button
              onClick={handleConfirmClick}
              className={styles.confirmButton}
            >
              Okay, got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

AddPeopleModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPeopleModal;
