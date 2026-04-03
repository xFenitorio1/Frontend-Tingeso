import axios from 'axios';
import keycloak from '../config/keycloak';

// Create an Axios instance pointing to the Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure the Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if the user is authenticated and token exists
    if (keycloak.authenticated && keycloak.token) {
      
      // Optional: Check if token is expired before sending request
      if (keycloak.isTokenExpired()) {
        try {
          // Attempt to refresh the token (minimum 5 sec validity)
          await keycloak.updateToken(5);
        } catch (error) {
          console.error("Token expiro y fallo el refresco", error);
          keycloak.logout();
        }
      }

      // Inject the Bearer token
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // You can trigger keycloak.login() or show a session expired toast here
      console.warn("Unauthorized API call. Token might be invalid.");
    }
    return Promise.reject(error);
  }
);

export default api;
