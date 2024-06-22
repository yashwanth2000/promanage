import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import nameIcon from "../../assets/name.png";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/lock.png";
import showIcon from "../../assets/eye.png";
import { register } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.deleted) {
      toast.success("Account deleted successfully", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!formData.name) {
      errors.name = "Please enter your name";
    }
    if (!formData.email) {
      errors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Please enter a password";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.values(errors).some((err) => err !== "")) {
      setErrors(errors);
    } else {
      try {
        const response = await register(formData);
        if (response.success) {
          navigate("/", { state: { registered: true } });
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setErrors({ ...errors, general: errorMsg });
        console.error("Error:", errorMsg);
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
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
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.inputContainer}>
          <img src={emailIcon} alt="Email Icon" className={styles.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.inputContainer}>
          <img
            src={passwordIcon}
            alt="Password Icon"
            className={styles.inputIcon}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
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
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.inputContainer}>
          <img
            src={passwordIcon}
            alt="Confirm Password Icon"
            className={styles.inputIcon}
          />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
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
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
      <p className={styles.registerText}>Have an account?</p>
      <Link to="/" className={styles.loginLink}>
        Login
      </Link>
      <ToastContainer />
    </div>
  );
};

export default Register;
