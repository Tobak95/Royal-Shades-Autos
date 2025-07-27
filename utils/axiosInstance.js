import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4152/api", //backend localhost URL
});
