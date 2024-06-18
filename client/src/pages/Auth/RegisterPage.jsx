import styles from "./RegisterPage.module.css"
import astronautImg from "../../assets/astronaut.png"
import Register from "../../components/Auth/Register"

const RegisterPage = () => {
    return (
    <div className={styles.registrationPage}>
      <div className={styles.leftSection}>
        <img src={astronautImg} alt="Astronaut" />
        <h2>Welcome aboard my friend</h2>
        <p>Just a couple of clicks and we start</p>
      </div>
      <div className={styles.rightSection}>
        <Register />
      </div>
    </div>
  );
}

export default RegisterPage