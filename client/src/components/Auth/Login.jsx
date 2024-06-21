import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/lock.png";
import showIcon from "../../assets/eye.png";
import { login } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Registered successfully. Please login", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.passwordChanged) {
      toast.success("Password changed. Please login", {
        position: "top-right",
        autoClose: 1000,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

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

    if (Object.values(errors).some((err) => err !== "")) {
      setErrors(errors);
    } else {
      try {
        const response = await login(formData);
        if (response.success) {
          navigate("/home", { state: { loggedIn: true } });
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
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
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
      <p className={styles.registerText}>Have no account yet?</p>
      <Link to="/register" className={styles.loginLink}>
        Register
      </Link>
      <ToastContainer />
    </div>
  );
};

export default Login;
