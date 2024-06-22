import NavBar from "../Navbar/NavBar";
import styles from "./Analytics.module.css";

const Analytics = () => {
  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2>Analytics</h2>
        <div className={styles.content}>
          <div>
            <ul className={styles.firstList}>
              <li>
                <span className={styles.label}>Backlog Tasks</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>To-do Tasks</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>In-Progress Tasks</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>Completed Tasks</span>
                <span className={styles.value}>0</span>
              </li>
            </ul>
          </div>

          <div>
            <ul className={styles.secondList}>
              <li>
                <span className={styles.label}>Low Priority</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>Moderate Priority</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>High Priority</span>
                <span className={styles.value}>0</span>
              </li>
              <li>
                <span className={styles.label}>Due Date Tasks</span>
                <span className={styles.value}>0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
