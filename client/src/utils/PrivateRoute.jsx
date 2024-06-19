import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = () => {
  const isAuthenticated = !!Cookies.get("accessToken");
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
