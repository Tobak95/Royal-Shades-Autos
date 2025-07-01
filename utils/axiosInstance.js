import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://royal-shades-autos-backend.onrender.com/api",
});
