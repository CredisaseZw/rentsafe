import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({

   baseURL: API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

const fileApi = axios.create({
   baseURL: API_BASE_URL,
}); // USE THIS ONE FOR FILE TYPE UPLOADS

api.defaults.withCredentials = true

const apis = {
   api,
   fileApi,
};

export default apis;
