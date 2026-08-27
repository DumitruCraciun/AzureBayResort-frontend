// frontend/src/services/api.js
import axios from 'axios';

// Folosește variabila de mediu
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL); // Debug

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 secunde timeout pentru Render (care poate fi lent la wake-up)
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
	console.log('🔑 Interceptor - Token found:', token ? 'YES' : 'NO');
	
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
	  console.log('✅ Token added to headers');
    } else {
      console.log('❌ No token to add');
    }
    console.log('📤 URL:', config.url); 
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicii pentru autentificare
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicii pentru camere
export const roomService = {
  getAll: (filters = {}) => api.get('/rooms', { params: filters }),
  getById: (id) => api.get(`/rooms/${id}`),
  getTypes: () => api.get('/rooms/types'),
  checkAvailability: (id, checkIn, checkOut) => 
    api.get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } })
};

// Servicii pentru rezervări
export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  confirm: (id) => api.put(`/payments/confirm/${id}`)
};

// Servicii pentru plăți
export const paymentService = {
  createIntent: (bookingId) => api.post('/payments/create-intent', { bookingId }),
  confirmBooking: (bookingId) => api.put(`/payments/confirm/${bookingId}`)
};

export default api;