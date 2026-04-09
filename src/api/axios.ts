import axios from 'axios';
import keycloak from '../config/keycloak';

const travelAgencyBackendServer = import.meta.env.VITE_TRAVELAGENCY_BACKEND_SERVER
const travelAgencyBackendPort = import.meta.env.VITE_TRAVELAGENCY_BACKEND_PORT

const api = axios.create({
  baseURL: `http://${travelAgencyBackendServer}:${travelAgencyBackendPort}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure the Request Interceptor
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated && keycloak.token) {
      if (keycloak.isTokenExpired()) {
        try {
          await keycloak.updateToken(5);
        } catch (error) {
          console.error("Token expiro y fallo el refresco", error);
          keycloak.logout();
        }
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API call. Token might be invalid.");
    }
    return Promise.reject(error);
  }
);

export default api;
