import { useState, useEffect } from "react";
import NavBar from "../Navbar/NavBar";
import { getTaskStats } from "../../../utils/task";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const [stats, setStats] = useState({
    backlogTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    lowPriorityTasks: 0,
    moderatePriorityTasks: 0,
    highPriorityTasks: 0,
    dueDateTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getTaskStats();
        if (response.success) {
          setStats(response.analytics);
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        toast.error("Failed to load analytics", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "light",
        });
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2>Analytics</h2>
        {loading ? (
          <div className={styles.loader}></div>
        ) : (
          <div className={styles.content}>
            <div>
              <ul className={styles.firstList}>
                <li>
                  <span className={styles.label}>Backlog Tasks</span>
                  <span className={styles.value}>{stats.backlogTasks}</span>
                </li>
                <li>
                  <span className={styles.label}>To-do Tasks</span>
                  <span className={styles.value}>{stats.todoTasks}</span>
                </li>
                <li>
                  <span className={styles.label}>In-Progress Tasks</span>
                  <span className={styles.value}>{stats.inProgressTasks}</span>
                </li>
                <li>
                  <span className={styles.label}>Completed Tasks</span>
                  <span className={styles.value}>{stats.completedTasks}</span>
                </li>
              </ul>
            </div>

            <div>
              <ul className={styles.secondList}>
                <li>
                  <span className={styles.label}>Low Priority</span>
                  <span className={styles.value}>{stats.lowPriorityTasks}</span>
                </li>
                <li>
                  <span className={styles.label}>Moderate Priority</span>
                  <span className={styles.value}>
                    {stats.moderatePriorityTasks}
                  </span>
                </li>
                <li>
                  <span className={styles.label}>High Priority</span>
                  <span className={styles.value}>
                    {stats.highPriorityTasks}
                  </span>
                </li>
                <li>
                  <span className={styles.label}>Due Date Tasks</span>
                  <span className={styles.value}>{stats.dueDateTasks}</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Analytics;
