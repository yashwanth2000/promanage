import axios from "axios";
const backendUrl = import.meta.env.VITE_SERVER_URL;
const token = localStorage.getItem("accessToken");

export const getUserId = async (userId) => {
  try {
    const reqUrl = `${backendUrl}/api/users/get/${userId}`;
    const response = await axios.get(reqUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

export const updateUser = async (userId, data) => {
  try {
    const reqUrl = `${backendUrl}/api/users/update/${userId}`;
    const response = await axios.put(reqUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

export const deleteUser = async (userId) => {
  try {
    const reqUrl = `${backendUrl}/api/users/delete/${userId}`;
    const response = await axios.delete(reqUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("User deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
  }
};
