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
                Backlog Tasks <span>0</span>
              </li>
              <li>
                To-do Tasks <span>0</span>
              </li>
              <li>
                In-Progress Tasks <span>0</span>
              </li>
              <li>
                Completed Tasks <span>0</span>
              </li>
            </ul>
          </div>

          <div>
            <ul className={styles.secondList}>
              <li>
                Low Priority <span>0</span>
              </li>
              <li>
                Moderate Priority <span>0</span>
              </li>
              <li>
                High Priority <span>0</span>
              </li>
              <li>
                Due Date Tasks <span>0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
