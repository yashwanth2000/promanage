import { useState } from "react";
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import logoutIcon from "../../../assets/logout.png";
import settingsIcon from "../../../assets/settings.png";
import analyticsIcon from "../../../assets/analytics.png";
import boardIcon from "../../../assets/layout.png";
import logoIcon from "../../../assets/logo.png";
import { logout } from "../../../utils/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/", { state: { loggedOut: true } });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.titleContainer}>
        <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
        <h2 className={styles.title} onClick={() => navigate("/home")}>
          ProManage
        </h2>
      </div>

      <div className={styles.links}>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.isActive}` : styles.link
          }
        >
          <img src={boardIcon} alt="Board" className={styles.icon} />
          Board
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.isActive}` : styles.link
          }
        >
          <img src={analyticsIcon} alt="Analytics" className={styles.icon} />
          Analytics
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.isActive}` : styles.link
          }
        >
          <img src={settingsIcon} alt="Settings" className={styles.icon} />
          Settings
        </NavLink>
      </div>

      <div className={styles.logout}>
        <img src={logoutIcon} alt="Logout" className={styles.icon} />
        <button className={styles.logoutButton} onClick={toggleModal}>
          Log Out
        </button>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to log out?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleLogout}>Yes, Log Out</button>
              <button onClick={toggleModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
