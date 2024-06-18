import styles from "./LoginPage.module.css";
import astronautImg from "../../assets/astronaut.png";
import Login from "../../components/Auth/Login";

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSection}>
        <img src={astronautImg} alt="Astronaut" />
        <h2>Welcome aboard my friend</h2>
        <p>Just a couple of clicks and we start</p>
      </div>
      <div className={styles.rightSection}>
        <Login />
      </div>
    </div>
  )
}

export default LoginPage