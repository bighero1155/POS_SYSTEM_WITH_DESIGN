import axios from "../auth/axiosInstance";

const API_URL = 'http://127.0.0.1:8000/api/reports';

export const getProductStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/product-status`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product status:', error);
        throw error;
    }
};
