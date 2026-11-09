import axios from 'axios';
import config from '../config/app.config';

// ─── Axios instance ──────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,          // Send cookies (refresh-token cookie)
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor – attach JWT access token ───────────────────────────

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('jpp_access_token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor – handle 401 / token refresh ───────────────────────

let isRefreshing  = false;
let refreshQueue  = [];           // Pending requests while refreshing

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Handle 401 (unauthorized) – attempt token refresh once
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue this request until the refresh resolves
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing    = true;

      try {
        const { data } = await axios.post(
          `${config.apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.data?.accessToken;
        if (newToken) {
          localStorage.setItem('jpp_access_token', newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          refreshQueue.forEach(({ resolve }) => resolve(newToken));
          refreshQueue = [];
          return api(original);
        }
      } catch (_err) {
        // Refresh failed – clear session and redirect to login
        refreshQueue.forEach(({ reject }) => reject(_err));
        refreshQueue = [];
        localStorage.removeItem('jpp_access_token');
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
