import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_URL_DEPLOYMENT;


const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  return api;
};

const apiTemplatesBingo = createAxiosInstance(`${API_BASE_URL}/templates`);
const apiBingoRoom = createAxiosInstance(`${API_BASE_URL}/rooms`);

export { apiTemplatesBingo, apiBingoRoom };
