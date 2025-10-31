import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2121",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (csrfToken && config.headers) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

export default api

