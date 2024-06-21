import { useState, useEffect } from "react";
import NavBar from "../Navbar/NavBar";
import nameIcon from "../../../assets/name.png";
import emailIcon from "../../../assets/email.png";
import passwordIcon from "../../../assets/lock.png";
import showIcon from "../../../assets/eye.png";
import styles from "./Settings.module.css";
import { getUserData, updateUser, deleteUser } from "../../../utils/user";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Settings = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        const user = response;
        setUserId(user._id);
        setFormData({
          name: user.name,
          email: user.email,
          oldPassword: "",
          newPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        navigate("/register", { state: { deleted: true } });
      } else {
        console.error("Error deleting account:", response.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await updateUser(userId, formData);
      if (response.success) {
        toast.success("Profile updated successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });

        if (formData.newPassword) {
          localStorage.removeItem("accessToken");
          Cookies.remove("accessToken");
          navigate("/", { state: { passwordChanged: true } });
        }

        setFormData({
          ...formData,
          oldPassword: "",
          newPassword: "",
        });
      } else {
        console.error("Error updating profile:", response.message);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className={styles.settingsContainer}>
        <h2>Settings</h2>
        <form onSubmit={handleUpdate} className={styles.updateForm}>
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
