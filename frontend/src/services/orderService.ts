import axios from "../auth/axiosInstance";

const API_BASE_URL = "http://localhost:8000/api/orders";

export const createOrder = async (orderData: any) => {
  const resp = await axios.post(`${API_BASE_URL}/store`, orderData);
  return resp.data.order;   
};