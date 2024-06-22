import { useState } from "react";
import NavBar from "../Navbar/NavBar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import peopleIcon from "../../../assets/addpeople.png";
import collapseAllIcon from "../../../assets/collapse-all.png";
import plusIcon from "../../../assets/plus.png";
import AddPeopleModal from "./AddPeopleModal";
import styles from "./Board.module.css";

const Board = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);

  useEffect(() => {
    if (location.state?.loggedIn) {
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }, [location.state]);

  const toggleAddPeopleModal = () => {
    setShowAddPeopleModal(!showAddPeopleModal);
  };

  const handleAddPeople = (email) => {
    console.log(email);
  };

  const options = { day: "2-digit", month: "short", year: "numeric" };

  const formattedDate = new Date()
    .toLocaleDateString("en-GB", options)
    .replace(/ /g, ", ");

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className={styles.boardContainer}>
        <main className={styles.mainContent}>
          <header className={styles.header}>
            <h1>Welcome! {user.name}</h1>
            <p>{formattedDate}</p>
          </header>
          <div className={styles.boardHeader}>
            <div className={styles.boardHeaderLeft}>
              <h2>Board</h2>
              <img src={peopleIcon} alt="Add" className={styles.peopleIcon} />
              <button className={styles.addButton} onClick={toggleAddPeopleModal}>Add People</button>
            </div>
            <select className={styles.timeFilter} defaultValue="This week">
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
          <div className={styles.columns}>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>Backlog</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {/* <div className={styles.cardPlaceholder}></div> */}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>To do</h3>
                <div>
                  <img src={plusIcon} alt="Plus" className={styles.plusIcon} />
                  <img src={collapseAllIcon} alt="Collapse All" />
                </div>
              </div>
              {/* <div className={styles.cardPlaceholder}></div> */}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>In Progress</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {/* <div className={styles.cardPlaceholder}></div> */}
            </div>
            <div className={styles.column}>
              <div className={styles.taskHeader}>
                <h3>Done</h3>
                <img src={collapseAllIcon} alt="Collapse All" />
              </div>
              {/* <div className={styles.cardPlaceholder}></div> */}
            </div>
          </div>
        </main>
      </div>
      <AddPeopleModal
        show={showAddPeopleModal}
        onClose={toggleAddPeopleModal}
        onAdd={handleAddPeople}
      />
    </>
  );
};

export default Board;
