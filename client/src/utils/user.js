import axios from "axios";
const backendUrl = import.meta.env.VITE_SERVER_URL;

const getToken = () => localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const updateUser = async (userId, data) => {
  try {
    const response = await axiosInstance.put(
      `/api/user/update/${userId}`,
      data
    );
    if (response.data.token) {
      localStorage.setItem("accessToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/api/user/delete/${userId}`);
    localStorage.removeItem("accessToken");
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
