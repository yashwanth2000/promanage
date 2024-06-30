import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import nameIcon from "../../assets/name.png";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/lock.png";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hide-eye.png";
import { register } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmPasswordIcon, setShowConfirmPasswordIcon] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setShowPasswordIcon(!showPasswordIcon);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setShowConfirmPasswordIcon(!showConfirmPasswordIcon);
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
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
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
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <img
              src={emailIcon}
              alt="Email Icon"
              className={styles.inputIcon}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
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
              src={showPassword ? hideEye : showEye}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className={`${styles.showIcon} ${
                showPassword ? styles.active : ""
              }`}
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
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
              src={showConfirmPassword ? hideEye : showEye}
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
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button}>
          {isLoading ? <div className={styles.loader}></div> : "Register"}
        </button>
      </form>
      <div className={styles.loginContainer}>
        <p className={styles.loginText}>Have an account?</p>
        <Link to="/" className={styles.loginLink}>
          Login
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
