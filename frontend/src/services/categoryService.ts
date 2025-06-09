import axios from "../auth/axiosInstance";

const API_BASE_URL = "http://localhost:8000/api/categories";

export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data.categories;
};

export const createCategory = async (data: { name: string }) => {
  const response = await axios.post(`${API_BASE_URL}`, data);
  return response.data.category;
};

export const updateCategory = async (id: number, data: { name: string }) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data.category;
};

export const deleteCategory = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
