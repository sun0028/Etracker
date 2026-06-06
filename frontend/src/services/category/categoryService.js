import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const getToken = () => getUserFromStorage();

// Add category
export const addCategoryAPI = async ({ name, type }) => {
  const response = await axios.post(
    `${BASE_URL}/categories/create`,
    { name, type },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

// Update category
export const updateCategoryAPI = async ({ name, type, id }) => {
  const response = await axios.put(
    `${BASE_URL}/categories/update/${id}`,
    { name, type },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

// Delete category
export const deleteCategoryAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/categories/delete/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// List categories
export const listCategoriesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/categories/lists`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};