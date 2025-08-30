import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
const AI_SERVICE_URL = 'http://localhost:8000';

// API del backend
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true
});

// API del servicio de IA
const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 15000
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para manejar errores y renovar tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el token expiró y no hemos intentado renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si no se puede renovar, limpiar y redirigir
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
};

// Courses endpoints
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getModules: (id) => api.get(`/courses/${id}/modules`),
};

// Tutor endpoints (conexión al servicio de IA)
export const tutorAPI = {
  chat: (data) => aiApi.post('/chat', data),
  getHistory: (studentId) => aiApi.get(`/history/${studentId}`),
  evaluate: (data) => aiApi.post('/evaluate', data),
};

// Assessments endpoints
export const assessmentsAPI = {
  getCourseAssessments: (courseId) => api.get(`/assessments/course/${courseId}`),
  submit: (data) => api.post('/assessments/submit', data),
};

export default api;