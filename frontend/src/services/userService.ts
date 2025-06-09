import axios from "../auth/axiosInstance";

const API_URL = "http://localhost:8000/api/users";

export const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export const deleteUser = async (userId: number) => {
  return axios.delete(`${API_URL}/${userId}`);
};

export const updateUser = async (userId: number, userData: any) => {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data.user;
};