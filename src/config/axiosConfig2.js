import axios from 'axios'

// Cấu hình mặc định cho axios
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_URL2 || 'http://localhost:5001/predict',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Tạo axios instance mặc định
const createApiClient2 = (customConfig = {}) => {
  const apiClient = axios.create({
    ...defaultConfig,
    ...customConfig
  })

  // Request interceptor - tự động thêm token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor - xử lý response và lỗi
  apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Xử lý lỗi 401 - token hết hạn
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        // Redirect tới login (có thể customize)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      
      // Log lỗi chi tiết
      console.error('❌ Response Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        endpoint: error.config?.url
      })
      
      return Promise.reject(error)
    }
  )

  return apiClient
}

// Export default instance
export const apiClient = createApiClient()

// Export factory function để tạo instance tùy chỉnh
export { createApiClient }

// Export cấu hình mặc định
export { defaultConfig }

// Helper function để tạo service với base endpoint
export const createServiceClient = (baseEndpoint, customConfig = {}) => {
  const client = createApiClient(customConfig)
  
  return {
    client,
    // CRUD methods với base endpoint
    get: (endpoint = '', config = {}) => client.get(`${baseEndpoint}${endpoint}`, config),
    post: (endpoint = '', data = {}, config = {}) => client.post(`${baseEndpoint}${endpoint}`, data, config),
    put: (endpoint = '', data = {}, config = {}) => client.put(`${baseEndpoint}${endpoint}`, data, config),
    delete: (endpoint = '', config = {}) => client.delete(`${baseEndpoint}${endpoint}`, config),
    patch: (endpoint = '', data = {}, config = {}) => client.patch(`${baseEndpoint}${endpoint}`, data, config),
  }
} 