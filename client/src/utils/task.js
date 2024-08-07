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

export const createTask = async (data) => {
  try {
    const response = await axiosInstance.post("/api/task/createTask", data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.get(`/api/task/getTaskById/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};
export const getAllTasks = async (filter = "week") => {
  try {
    const response = await axiosInstance.get(
      `/api/task/getAllTasks?filter=${filter}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/task/deleteTask/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axiosInstance.patch(
      `/api/task/updateTaskStatus/${taskId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const updateTask = async (taskId, data) => {
  try {
    const response = await axiosInstance.patch(
      `/api/task/updateTask/${taskId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskChecklist = async (taskId, subTaskId, completed) => {
  try {
    const response = await axiosInstance.put(
      `/api/task/${taskId}/subtasks/${subTaskId}`,
      completed
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task checklist:", error);
    throw error;
  }
};

export const getTaskStats = async () => {
  try {
    const response = await axiosInstance.get("/api/task/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching task stats:", error);
    throw error;
  }
};
