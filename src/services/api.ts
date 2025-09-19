import axios from 'axios';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const scrapeAPI = {
  // Start a new scrape job
  startScrape: async (data: {
    query: string;
    url?: string;
    platforms: string[];
    max_results: number;
  }) => {
    // Mock response for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            task_id: `task_${Date.now()}`,
            status: 'pending',
            message: 'Scrape job queued successfully',
          }
        });
      }, 1000);
    });
  },

  // Get scrape results by task ID
  getResults: async (taskId: string) => {
    // Mock response for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            task_id: taskId,
            status: 'completed',
            results: [
              {
                platform: 'google',
                business_name: 'Sample Business',
                description: 'A sample business for testing',
                phone: '+1 (555) 123-4567',
                website: 'https://example.com',
                address: '123 Main St, City, State',
              }
            ]
          }
        });
      }, 1000);
    });
  },

  // Get all tasks
  getTasks: async () => {
    // Mock response for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            tasks: [
              {
                id: 'task_001',
                query: 'restaurants in Manhattan',
                platforms: ['google', 'facebook'],
                status: 'completed',
                created_at: new Date().toISOString(),
              }
            ]
          }
        });
      }, 500);
    });
  },

  // Get task status
  getTaskStatus: async (taskId: string) => {
    // Mock response for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            task_id: taskId,
            status: Math.random() > 0.5 ? 'completed' : 'running',
            progress: Math.floor(Math.random() * 100),
          }
        });
      }, 300);
    });
  },
};

export default api;