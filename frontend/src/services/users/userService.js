import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const getToken = () => getUserFromStorage();

export const loginAPI = async ({ email, password }) => {
  const response = await axios.post(`${BASE_URL}/users/login`, { email, password });
  return response.data;
};

export const registerAPI = async ({ email, password, username }) => {
  const response = await axios.post(`${BASE_URL}/users/register`, { email, password, username });
  return response.data;
};

export const changePasswordAPI = async (newPassword) => {
  const response = await axios.put(
    `${BASE_URL}/users/change-passwords`,
    { newPassword },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

export const updateProfileAPI = async ({ email, username }) => {
  const response = await axios.put(
    `${BASE_URL}/users/update-profile`,
    { email, username },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};