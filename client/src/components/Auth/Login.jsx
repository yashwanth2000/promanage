import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/lock.png";
import showEye from "../../assets/eye.png";
import hideEye from "../../assets/hide-eye.png";
import { login } from "../../utils/auth";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Registered successfully. Please login", {
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

  useEffect(() => {
    if (location.state?.loggedOut) {
      toast.success("Logged out successfully", {
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

  useEffect(() => {
    if (location.state?.passwordChanged) {
      toast.success("Password changed. Please login", {
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
        setIsLoading(true);
        const response = await login(formData);
        if (response.success) {
          Cookies.set("accessToken", response.token);
          localStorage.setItem("accessToken", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          navigate("/home", { state: { loggedIn: true } });
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
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
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
              src={showPasswordIcon ? hideEye : showEye}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className={styles.showIcon}
              onClick={togglePasswordVisibility}
            />
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <button type="submit" className={styles.button}>
          {isLoading ? <div className={styles.loader}></div> : "Login"}
        </button>
      </form>

      <div className={styles.registerContainer}>
        <p className={styles.registerText}>Have no account yet?</p>
        <Link to="/register" className={styles.registerLink}>
          Register
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
