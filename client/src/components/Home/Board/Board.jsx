import NavBar from "../Navbar/NavBar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const Board = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.loggedIn) {
      toast.success("Login successful", {
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

  return (
    <>
      <NavBar />
      <ToastContainer />
    </>
  );
};

export default Board;
