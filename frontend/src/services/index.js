import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_URL_DEPLOYMENT;


const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  return api;
};

const apiBingo = createAxiosInstance(`${API_BASE_URL}/bingos`);
const apiBingoRoom = createAxiosInstance(`${API_BASE_URL}/rooms`);
const apiTemplatesBingo = createAxiosInstance(`${API_BASE_URL}/templates`);

export { apiBingo, apiBingoRoom, apiTemplatesBingo };
