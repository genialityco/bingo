import axios from "axios";

const API_BASE_URL =
import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_APP_API_URL
    : import.meta.env.VITE_APP_URL_DEPLOYMENT;


const createAxiosInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
  });

  return api;
};

const apiBingo = createAxiosInstance(`${API_BASE_URL}/bingos`);
const apiBingoTemplate = createAxiosInstance(`${API_BASE_URL}/bingoTemplate`);
const apiBingoFigures = createAxiosInstance(`${API_BASE_URL}/figure`);
const apiBingoCardboard = createAxiosInstance(`${API_BASE_URL}/cardboard`);

export { apiBingoTemplate, apiBingo, apiBingoFigures, apiBingoCardboard };
