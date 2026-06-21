import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('astronet_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('astronet_token');
      localStorage.removeItem('astronet_user');
      window.location.href = '/#/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Missions
export const missionAPI = {
  getAll: (params) => API.get('/missions', { params }),
  getById: (id) => API.get(`/missions/${id}`),
  getStats: () => API.get('/missions/stats'),
  create: (data) => API.post('/missions', data),
  update: (id, data) => API.put(`/missions/${id}`, data),
  delete: (id) => API.delete(`/missions/${id}`),
};

// Telemetry
export const telemetryAPI = {
  getLive: () => API.get('/telemetry/live'),
  getLatest: (missionId) => API.get(`/telemetry/${missionId}/latest`),
  getHistory: (missionId, params) => API.get(`/telemetry/${missionId}/history`, { params }),
};

// Incidents
export const incidentAPI = {
  getAll: (params) => API.get('/incidents', { params }),
  getById: (id) => API.get(`/incidents/${id}`),
  create: (data) => API.post('/incidents', data),
  update: (id, data) => API.put(`/incidents/${id}`, data),
  addTimeline: (id, data) => API.post(`/incidents/${id}/timeline`, data),
  delete: (id) => API.delete(`/incidents/${id}`),
};

// Logs
export const logAPI = {
  getAll: (params) => API.get('/logs', { params }),
  getSummary: () => API.get('/logs/summary'),
  create: (data) => API.post('/logs', data),
};

// DevOps
export const devopsAPI = {
  getStatus: () => API.get('/devops/status'),
  getDeployments: () => API.get('/devops/deployments'),
};

// Users
export const userAPI = {
  getAll: () => API.get('/users'),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
};

// Analytics
export const analyticsAPI = {
  getOverview: () => API.get('/analytics/overview'),
};

export default API;
