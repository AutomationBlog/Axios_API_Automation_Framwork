const axios = require('axios');
require('dotenv').config();

class ApiClient {
  constructor(baseURL = process.env.BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: parseInt(process.env.API_TIMEOUT) || 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (process.env.AUTH_TOKEN) {
          config.headers.Authorization = `Bearer ${process.env.AUTH_TOKEN}`;
        }
        
        // Log request details
        console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[REQUEST ERROR]', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[RESPONSE] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          console.error(`[RESPONSE ERROR] ${error.response.status} ${error.config.url}`);
        } else {
          console.error('[NETWORK ERROR]', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

module.exports = ApiClient;
