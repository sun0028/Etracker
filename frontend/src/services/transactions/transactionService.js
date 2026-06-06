import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const getToken = () => getUserFromStorage();

// Add transaction
export const addTransactionAPI = async ({ type, category, date, description, amount }) => {
  const response = await axios.post(
    `${BASE_URL}/transactions/create`,
    { category, date, description, amount, type },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

// List transactions with filters
export const listTransactionsAPI = async (filters = {}) => {
  const { category, type, startDate, endDate } = filters;
  const response = await axios.get(`${BASE_URL}/transactions/lists`, {
    params: { category, endDate, startDate, type },
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Delete transaction
export const deleteTransactionAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/transactions/delete/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Update transaction
export const updateTransactionAPI = async ({ id, type, category, amount, date, description }) => {
  const response = await axios.put(
    `${BASE_URL}/transactions/update/${id}`,
    { type, category, amount, date, description },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};