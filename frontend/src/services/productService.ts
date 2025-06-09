import axios from "../auth/axiosInstance";

const API_BASE_URL = "http://localhost:8000/api/products";

export const getAllProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data.products;
};

export const createProduct = async (productData: FormData) => { 
  const response = await axios.post(`${API_BASE_URL}/store`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.product;
};

export const updateProduct = async (id: number, productData: FormData) => {
  productData.append("_method", "PUT"); 

  const response = await axios.post(`${API_BASE_URL}/update/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.product;
};


export const deleteProduct = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/delete/${id}`);
};

export const getLowStockProducts = async (threshold: number) => {
  const response = await axios.get(`${API_BASE_URL}/low-stock`, {
    params: { threshold },
  });
  return response.data.lowStockProducts;
};