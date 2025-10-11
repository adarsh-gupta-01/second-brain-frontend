// Centralized API client for frontend-backend communication

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_KEY || '/api/v1';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/signin';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  // Auth endpoints
  login: (credentials: { username: string; password: string }) =>
    apiClient.post('/login', credentials),
    
  signup: (userData: { username: string; password: string; firstName?: string }) =>
    apiClient.post('/signup', userData),
    
  logout: () => apiClient.post('/logout'),
  
  getCurrentUser: () => apiClient.get('/me'),
  
  updateProfile: (profileData: { firstName?: string; avatar?: string; bio?: string }) =>
    apiClient.put('/me', profileData),
};

export const contentAPI = {
  // Content endpoints
  createContent: (contentData: FormData | object) => {
    const config: AxiosRequestConfig = {};
    if (contentData instanceof FormData) {
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    return apiClient.post('/content', contentData, config);
  },
  
  getAllContent: (filters?: { type?: string; tag?: string }) =>
    apiClient.get('/content', { params: filters }),
    
  updateContent: (contentData: { 
    contentId: string; 
    title: string; 
    link?: string; 
    tags?: string[]; 
    content?: string 
  }) => apiClient.put('/content', contentData),
  
  deleteContent: (contentId: string) =>
    apiClient.delete('/content', { data: { contentId } }),
    
  getContentStats: () => apiClient.get('/content/stats'),
  
  getContentById: (contentId: string) =>
    apiClient.get(`/content/${contentId}`),
};

export const shareAPI = {
  // Share endpoints
  toggleShare: (share: boolean) =>
    apiClient.post('/brain/share', { share }),
    
  getShareInfo: () => apiClient.get('/brain/share'),
  
  getSharedBrain: (shareLink: string) =>
    apiClient.get(`/brain/${shareLink}`),
};

// Generic API call function
export const apiCall = async <T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.request({
    method,
    url: endpoint,
    data,
    ...config,
  });
  return response.data;
};

// Health check
export const healthCheck = () => apiClient.get('/health');

export default apiClient;