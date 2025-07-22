import axios from "axios";

const API_KEY =   "61628c4e3223a1bf07cb224fc9928918";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export default api;
