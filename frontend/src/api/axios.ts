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

const attachToken = (config: any) => {
   let token: string | null = localStorage.getItem("token");
   let parsedToken: { access_token?: string } | null = null;

   try {
      parsedToken = token ? JSON.parse(token) : null;
   } catch (err) {
      parsedToken = null;
   }

   if (parsedToken?.access_token) {
      config.headers.Authorization = `Bearer ${parsedToken.access_token}`;
   }

   return config;
};

api.interceptors.request.use(attachToken);
fileApi.interceptors.request.use(attachToken);

const apis = {
   api,
   fileApi,
};

export default apis;
