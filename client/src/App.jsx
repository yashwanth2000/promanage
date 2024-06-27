import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import "./App.css";
import Board from "./components/Home/Board/Board";
import Analytics from "./components/Home/Analytics/Analytics";
import Settings from "./components/Home/Settings/Settings";
import PrivateRoute from "./utils/PrivateRoute";
import ShareTask from "./components/Home/Board/ShareTask";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Board />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/share/:id" element={<ShareTask />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
