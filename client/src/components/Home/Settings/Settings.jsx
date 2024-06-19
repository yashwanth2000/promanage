import { useState } from "react";
import NavBar from "../Navbar/NavBar";
import nameIcon from "../../../assets/name.png";
import emailIcon from "../../../assets/email.png";
import passwordIcon from "../../../assets/lock.png";
import showIcon from "../../../assets/eye.png";
import styles from "./Settings.module.css";
import { toast, ToastContainer } from "react-toastify";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email || !formData.oldPassword || !formData.newPassword) {
      toast.error("One of the field must be filled", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      return;
    }
    console.log(formData);
  };

  return (
    <>
      <NavBar />
      <div className={styles.settingsContainer}>
        <h2>Settings</h2>
        <form onSubmit={handleSubmit} className={styles.updateForm}>
          <div className={styles.inputContainer}>
            <img src={nameIcon} alt="Name Icon" className={styles.inputIcon} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={emailIcon}
              alt="Email Icon"
              className={styles.inputIcon}
            />
            <input
              type="email"
              name="email"
              placeholder="Update Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={passwordIcon}
              alt="Password Icon"
              className={styles.inputIcon}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className={styles.inputField}
            />
            <img
              src={showIcon}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className={`${styles.showIcon} ${
                showPassword ? styles.active : ""
              }`}
              onClick={togglePasswordVisibility}
            />
          </div>
          <div className={styles.inputContainer}>
            <img
              src={passwordIcon}
              alt="Confirm Password Icon"
              className={styles.inputIcon}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.inputField}
            />
            <img
              src={showIcon}
              alt={
                showConfirmPassword
                  ? "Hide Confirm Password"
                  : "Show Confirm Password"
              }
              className={`${styles.showIcon} ${
                showConfirmPassword ? styles.active : ""
              }`}
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
          <button type="submit" className={styles.button}>
            Update
          </button>
          <button
            type="button"
            className={styles.delButton}
            onClick={toggleModal}
          >
            Delete User
          </button>
        </form>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>Are you sure you want to delete your account?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleDeleteAccount}>Yes, Delete</button>
                <button onClick={toggleModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Settings;
